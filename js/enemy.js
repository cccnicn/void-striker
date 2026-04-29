const Enemies = {
    list: [],

    spawn(type, x, y) {
        const e = this.create(type, x, y);
        this.list.push(e);
        return e;
    },

    create(type, x, y) {
        const base = { x, y, vx: 0, vy: 0, angle: 0, alive: true, type, fireTimer: 0, dashTimer: 0, dashCooldown: 0, isDashing: false, dashVx: 0, dashVy: 0 };
        switch (type) {
            case 'chaser':
                return { ...base, radius: 10, hp: 1, maxHp: 1, speed: 150, scoreValue: 10, color: '#f44', sides: 4 };
            case 'shooter':
                return { ...base, radius: 14, hp: 2, maxHp: 2, speed: 80, scoreValue: 25, color: '#f80', sides: 6, fireTimer: 1.5 + Math.random() };
            case 'tank':
                return { ...base, radius: 22, hp: 5, maxHp: 5, speed: 60, scoreValue: 50, color: '#f0f', sides: 4 };
            case 'dasher':
                return { ...base, radius: 10, hp: 1, maxHp: 1, speed: 100, scoreValue: 20, color: '#ff0', sides: 3, dashCooldown: 2 + Math.random(), dashTimer: 0, isDashing: false };
            case 'splitter':
                return { ...base, radius: 16, hp: 3, maxHp: 3, speed: 90, scoreValue: 30, color: '#0f0', sides: 8 };
            default:
                return { ...base, radius: 10, hp: 1, maxHp: 1, speed: 100, scoreValue: 10, color: '#f44', sides: 4 };
        }
    },

    update(dt) {
        const px = Player.x, py = Player.y;
        for (let i = this.list.length - 1; i >= 0; i--) {
            const e = this.list[i];
            if (!e.alive) {
                this.list.splice(i, 1);
                continue;
            }
            this.updateBehavior(e, dt, px, py);
            e.x += e.vx * dt;
            e.y += e.vy * dt;
            e.x = Utils.clamp(e.x, e.radius, Utils.WORLD_W - e.radius);
            e.y = Utils.clamp(e.y, e.radius, Utils.WORLD_H - e.radius);
            Game.checkObstacleCollision(e);
            e.angle = Utils.angle(e.x, e.y, px, py);
        }
    },

    updateBehavior(e, dt, px, py) {
        const dx = px - e.x, dy = py - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / dist, ny = dy / dist;

        switch (e.type) {
            case 'chaser':
                e.vx = nx * e.speed;
                e.vy = ny * e.speed;
                break;

            case 'shooter':
                if (dist > 250) { e.vx = nx * e.speed; e.vy = ny * e.speed; }
                else if (dist < 180) { e.vx = -nx * e.speed; e.vy = -ny * e.speed; }
                else {
                    const perpX = -ny, perpY = nx;
                    e.vx = perpX * e.speed * 0.5;
                    e.vy = perpY * e.speed * 0.5;
                }
                e.fireTimer -= dt;
                if (e.fireTimer <= 0 && e.alive) {
                    e.fireTimer = 1.5 + Math.random() * 0.5;
                    const ang = Utils.angle(e.x, e.y, px, py);
                    const spd = 250;
                    Bullets.spawn(e.x + Math.cos(ang) * 16, e.y + Math.sin(ang) * 16, Math.cos(ang) * spd, Math.sin(ang) * spd, 'enemy', 1, false);
                }
                break;

            case 'tank':
                e.vx = nx * e.speed;
                e.vy = ny * e.speed;
                break;

            case 'dasher':
                if (e.isDashing) {
                    e.dashTimer -= dt;
                    if (e.dashTimer <= 0) { e.isDashing = false; e.dashCooldown = 1.5 + Math.random(); }
                } else {
                    e.dashCooldown -= dt;
                    if (e.dashCooldown <= 0 && dist < 400) {
                        e.isDashing = true;
                        e.dashTimer = 0.3;
                        e.dashVx = nx * 600;
                        e.dashVy = ny * 600;
                    } else {
                        e.vx = nx * e.speed;
                        e.vy = ny * e.speed;
                    }
                }
                if (e.isDashing) { e.vx = e.dashVx; e.vy = e.dashVy; }
                break;

            case 'splitter':
                e.vx = nx * e.speed;
                e.vy = ny * e.speed;
                break;
        }
    },

    damage(e, amount) {
        e.hp -= amount;
        Particles.emit(e.x, e.y, 5, 'enemyHit');
        if (e.hp <= 0) {
            e.alive = false;
            Particles.emit(e.x, e.y, 15, e.type === 'splitter' ? 'green' : 'explode');
            Audio.play('explode');
            Game.score += e.scoreValue;
            PowerUps.tryDrop(e.x, e.y, e.type);

            const coinValues = { chaser: 10, shooter: 20, tank: 40, dasher: 15, splitter: 25 };
            Game.spawnCoin(e.x, e.y, coinValues[e.type] || 10);

            if (e.type === 'splitter') {
                for (let i = 0; i < 3; i++) {
                    const ang = Utils.PI2 / 3 * i;
                    const mini = this.create('chaser', e.x + Math.cos(ang) * 20, e.y + Math.sin(ang) * 20);
                    mini.radius = 7;
                    mini.hp = 1;
                    mini.speed = 180;
                    mini.color = '#8f8';
                    mini.scoreValue = 5;
                    this.list.push(mini);
                }
            }
        } else {
            Audio.play('hit');
        }
    },

    render(ctx) {
        for (const e of this.list) {
            ctx.save();
            ctx.translate(e.x, e.y);
            ctx.rotate(e.angle);

            ctx.shadowColor = e.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = e.color + '40';
            ctx.strokeStyle = e.color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            for (let i = 0; i < e.sides; i++) {
                const a = Utils.PI2 / e.sides * i - Math.PI / 2;
                const px = Math.cos(a) * e.radius;
                const py = Math.sin(a) * e.radius;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            if (e.hp < e.maxHp) {
                ctx.rotate(-e.angle);
                const bw = e.radius * 2;
                const bh = 3;
                const by = e.radius + 6;
                ctx.fillStyle = '#300';
                ctx.fillRect(-bw / 2, by, bw, bh);
                ctx.fillStyle = '#f44';
                ctx.fillRect(-bw / 2, by, bw * (e.hp / e.maxHp), bh);
            }

            ctx.shadowBlur = 0;
            ctx.restore();
        }
    },

    clear() {
        this.list = [];
    }
};
