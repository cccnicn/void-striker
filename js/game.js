const Game = {
    canvas: null,
    ctx: null,
    W: 0, H: 0,
    state: 'title',
    score: 0,
    currentLevel: 0,
    stars: [],
    obstacles: [],
    bgStyle: 'nebula',
    bgColor: '#0a0a1a',
    lastTime: 0,

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        Input.init(this.canvas);
        Particles.init();
        Bullets.init();

        this.canvas.addEventListener('click', () => {
            Audio.init();
            if (this.state === 'title') this.startGame();
            else if (this.state === 'gameover' || this.state === 'victory') this.startGame();
        });

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                if (this.state === 'playing' || this.state === 'wave_clear') this.state = 'paused';
                else if (this.state === 'paused') this.state = 'playing';
            }
        });

        this.generateStars();
        this.lastTime = performance.now();
        this.loop();
    },

    resize() {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        Camera.init(this.W, this.H);
    },

    generateStars() {
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Utils.rand(0, Utils.WORLD_W),
                y: Utils.rand(0, Utils.WORLD_H),
                size: Utils.rand(0.5, 2.5),
                alpha: Utils.rand(0.2, 0.8),
                depth: Utils.rand(0.3, 1)
            });
        }
    },

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.currentLevel = 0;
        this.obstacles = [];
        Player.init(Utils.WORLD_W / 2, Utils.WORLD_H / 2);
        Enemies.clear();
        Bullets.activeCount = 0;
        Particles.activeCount = 0;
        PowerUps.clear();
        Boss.clear();
        Spawner.clear();
        UI.waveTextTimer = 0;
        UI.bossTextTimer = 0;
        UI.screenFlash = 0;
        UI.slowMoTimer = 0;
        this.loadLevel(0);
    },

    loadLevel(index) {
        if (index >= Levels.list.length) {
            this.state = 'victory';
            return;
        }
        const lvl = Levels.list[index];
        this.currentLevel = index;
        this.bgColor = lvl.bgColor;
        this.bgStyle = lvl.bgStyle;
        this.obstacles = lvl.obstacles || [];
        Spawner.loadLevel(lvl);
    },

    loop() {
        const now = performance.now();
        let dt = (now - this.lastTime) / 1000;
        this.lastTime = now;
        dt = Math.min(dt, 0.033);

        this.update(dt);
        this.render();
        requestAnimationFrame(() => this.loop());
    },

    update(dt) {
        if (this.state === 'title' || this.state === 'gameover' || this.state === 'victory' || this.state === 'paused') {
            Input.update(Camera);
            return;
        }

        const timeScale = UI.getTimeScale();
        const gameDt = dt * timeScale;

        Input.update(Camera);
        Player.update(gameDt);
        Enemies.update(gameDt);
        Boss.update(gameDt);
        Bullets.update(gameDt);
        Spawner.update(gameDt);
        PowerUps.update(gameDt);
        Particles.update(gameDt);
        Camera.follow(Player, gameDt);
        Camera.update(dt);
        UI.update(dt);

        this.checkCollisions();

        if (!Player.alive && this.state === 'playing') {
            this.state = 'gameover';
            UI.slowMo(0);
        }

        if (Spawner.waveClear && this.state === 'playing') {
            Spawner.waveClear = false;
            this.loadLevel(this.currentLevel + 1);
        }
    },

    checkObstacleCollision(entity) {
        for (const o of this.obstacles) {
            if (Collision.circleRect(entity.x, entity.y, entity.radius, o.x, o.y, o.w, o.h)) {
                const cx = o.x + o.w / 2;
                const cy = o.y + o.h / 2;
                const dx = entity.x - cx;
                const dy = entity.y - cy;
                const halfW = o.w / 2 + entity.radius;
                const halfH = o.h / 2 + entity.radius;
                const overlapX = halfW - Math.abs(dx);
                const overlapY = halfH - Math.abs(dy);

                if (overlapX < overlapY) {
                    entity.x += dx > 0 ? overlapX : -overlapX;
                } else {
                    entity.y += dy > 0 ? overlapY : -overlapY;
                }
                return true;
            }
        }
        return false;
    },

    checkCollisions() {
        Collision.clear();
        for (const e of Enemies.list) Collision.insert(e);
        for (const p of PowerUps.list) Collision.insert(p);
        if (Boss.active && Boss.active.alive) Collision.insert(Boss.active);

        for (let i = Bullets.activeCount - 1; i >= 0; i--) {
            const b = Bullets.pool[i];
            if (b.ownerType === 'player') {
                const nearby = Collision.query(b);
                for (const target of nearby) {
                    if (target === Boss.active) {
                        if (Collision.circleCircle(b, target) && Boss.active.alive && Boss.active.invTimer <= 0) {
                            Boss.damage(b.damage);
                            if (!b.piercing || b.pierceCount <= 0) {
                                Bullets.removeAt(i);
                                break;
                            } else {
                                b.pierceCount--;
                            }
                        }
                    } else if (target.alive !== false && target.type) {
                        if (Collision.circleCircle(b, target)) {
                            Enemies.damage(target, b.damage);
                            if (!b.piercing || b.pierceCount <= 0) {
                                Bullets.removeAt(i);
                                break;
                            } else {
                                b.pierceCount--;
                            }
                        }
                    }
                }
            } else if (b.ownerType === 'enemy') {
                if (Collision.circleCircle(b, Player)) {
                    Player.takeDamage(b.damage);
                    Bullets.removeAt(i);
                }
            }
        }

        for (const e of Enemies.list) {
            if (Collision.circleCircle(e, Player)) {
                Player.takeDamage(1);
                const ang = Utils.angle(e.x, e.y, Player.x, Player.y);
                e.x += Math.cos(ang) * -50;
                e.y += Math.sin(ang) * -50;
            }
        }

        if (Boss.active && Boss.active.alive && !Boss.active.isCharging) {
            const dist = Utils.dist(Boss.active.x, Boss.active.y, Player.x, Player.y);
            if (dist < Boss.active.radius + Player.radius) {
                Player.takeDamage(2);
            }
        }

        for (let i = PowerUps.list.length - 1; i >= 0; i--) {
            const p = PowerUps.list[i];
            if (Utils.distSq(p.x, p.y, Player.x, Player.y) < (p.radius + Player.radius) * (p.radius + Player.radius)) {
                this.collectPowerUp(p);
                PowerUps.list.splice(i, 1);
            }
        }
    },

    collectPowerUp(p) {
        Audio.play('powerup');
        Particles.emit(p.x, p.y, 10, 'powerup');

        switch (p.type) {
            case 'health':
                Player.hp = Math.min(Player.hp + 1, Player.maxHp);
                break;
            case 'nuke':
                UI.flash('#fff', 0.5);
                UI.slowMo(0.5);
                Camera.shake(10, 0.5);
                for (const e of Enemies.list) {
                    e.alive = false;
                    Particles.emit(e.x, e.y, 10, 'explode');
                    Game.score += e.scoreValue;
                }
                Enemies.list = [];
                Audio.play('explode');
                break;
            case 'shield':
                Player.addEffect('shield', 30);
                Player.shieldHits = 3;
                break;
            case 'rapid_fire':
                Player.addEffect('rapid_fire', 10);
                break;
            case 'spread_shot':
                Player.addEffect('spread_shot', 8);
                break;
            case 'piercing':
                Player.addEffect('piercing', 8);
                break;
            case 'speed_boost':
                Player.addEffect('speed_boost', 10);
                break;
        }
    },

    render() {
        const ctx = this.ctx;
        const W = this.W, H = this.H;

        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, W, H);

        if (this.state === 'title') {
            UI.renderTitleScreen(ctx, W, H);
            return;
        }

        Camera.apply(ctx);
        this.renderBackground(ctx);
        this.renderObstacles(ctx);
        Bullets.render(ctx);
        Enemies.render(ctx);
        Boss.render(ctx);
        PowerUps.render(ctx);
        Player.render(ctx);
        Particles.render(ctx);
        Camera.restore(ctx);

        this.renderVignette(ctx, W, H);
        HUD.render(ctx, W, H);
        UI.renderOverlayTexts(ctx, W, H);

        if (this.state === 'paused') UI.renderPauseScreen(ctx, W, H);
        if (this.state === 'gameover') UI.renderGameOverScreen(ctx, W, H);
        if (this.state === 'victory') UI.renderVictoryScreen(ctx, W, H);
    },

    renderBackground(ctx) {
        for (const s of this.stars) {
            ctx.fillStyle = `rgba(180,200,255,${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Utils.PI2);
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(60,80,120,0.15)';
        ctx.lineWidth = 1;
        const gridSize = 100;
        for (let x = 0; x <= Utils.WORLD_W; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Utils.WORLD_H); ctx.stroke();
        }
        for (let y = 0; y <= Utils.WORLD_H; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Utils.WORLD_W, y); ctx.stroke();
        }

        ctx.strokeStyle = '#1a2a4a';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, Utils.WORLD_W, Utils.WORLD_H);
    },

    renderObstacles(ctx) {
        for (const o of this.obstacles) {
            ctx.fillStyle = 'rgba(30,40,60,0.8)';
            ctx.fillRect(o.x, o.y, o.w, o.h);
            ctx.strokeStyle = '#2a3a5a';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#2a3a5a';
            ctx.shadowBlur = 6;
            ctx.strokeRect(o.x, o.y, o.w, o.h);
            ctx.shadowBlur = 0;
        }
    },

    renderVignette(ctx, w, h) {
        const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.8);
        gradient.addColorStop(0, 'transparent');
        const intensity = Player.hp <= 2 ? 0.6 : 0.2;
        gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }
};
