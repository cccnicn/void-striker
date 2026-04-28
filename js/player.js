const Player = {
    x: 0, y: 0,
    vx: 0, vy: 0,
    angle: 0,
    radius: 14,
    speed: 300,
    hp: 5, maxHp: 5,
    alive: true,
    invTimer: 0,
    fireTimer: 0,
    fireRate: 0.12,
    speedMult: 1,
    fireRateMult: 1,
    spreadShot: false,
    piercing: false,
    shieldHits: 0,
    activeEffects: [],

    init(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.hp = this.maxHp;
        this.alive = true;
        this.invTimer = 0;
        this.fireTimer = 0;
        this.speedMult = 1;
        this.fireRateMult = 1;
        this.spreadShot = false;
        this.piercing = false;
        this.shieldHits = 0;
        this.activeEffects = [];
    },

    update(dt) {
        if (!this.alive) return;

        let ax = 0, ay = 0;
        if (Input.isDown('KeyW') || Input.isDown('ArrowUp')) ay -= 1;
        if (Input.isDown('KeyS') || Input.isDown('ArrowDown')) ay += 1;
        if (Input.isDown('KeyA') || Input.isDown('ArrowLeft')) ax -= 1;
        if (Input.isDown('KeyD') || Input.isDown('ArrowRight')) ax += 1;

        const len = Math.sqrt(ax * ax + ay * ay);
        if (len > 0) { ax /= len; ay /= len; }

        const spd = this.speed * this.speedMult;
        const accel = 2000;
        const friction = 8;

        this.vx += ax * accel * dt;
        this.vy += ay * accel * dt;
        this.vx -= this.vx * friction * dt;
        this.vy -= this.vy * friction * dt;

        const vel = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (vel > spd) {
            this.vx = (this.vx / vel) * spd;
            this.vy = (this.vy / vel) * spd;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.x = Utils.clamp(this.x, this.radius, Utils.WORLD_W - this.radius);
        this.y = Utils.clamp(this.y, this.radius, Utils.WORLD_H - this.radius);

        this.angle = Utils.angle(this.x, this.y, Input.mouse.worldX, Input.mouse.worldY);

        this.fireTimer -= dt;
        if (Input.mouse.down && this.fireTimer <= 0) {
            this.fire();
        }

        if (this.invTimer > 0) this.invTimer -= dt;

        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            this.activeEffects[i].timer -= dt;
            if (this.activeEffects[i].timer <= 0) {
                this.removeEffect(this.activeEffects[i].type);
                this.activeEffects.splice(i, 1);
            }
        }

        if (this.vx * this.vx + this.vy * this.vy > 100) {
            const thrustAngle = this.angle + Math.PI;
            Particles.emit(
                this.x + Math.cos(thrustAngle) * 10 + Utils.rand(-3, 3),
                this.y + Math.sin(thrustAngle) * 10 + Utils.rand(-3, 3),
                1, 'thrust'
            );
        }
    },

    fire() {
        const rate = this.fireRate / this.fireRateMult;
        this.fireTimer = rate;
        const speed = 600;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const bx = this.x + cos * 18;
        const by = this.y + sin * 18;

        if (this.spreadShot) {
            for (let a = -1; a <= 1; a++) {
                const ang = this.angle + a * 15 * Utils.DEG;
                Bullets.spawn(bx, by, Math.cos(ang) * speed, Math.sin(ang) * speed, 'player', 1, this.piercing);
            }
        } else {
            Bullets.spawn(bx, by, cos * speed, sin * speed, 'player', 1, this.piercing);
        }

        Particles.emit(bx, by, 3, 'muzzle');
        Audio.play('shoot');
    },

    takeDamage(amount) {
        if (this.invTimer > 0) return;
        if (this.shieldHits > 0) {
            this.shieldHits--;
            this.invTimer = 0.3;
            Audio.play('hit');
            Particles.emit(this.x, this.y, 8, 'shieldBreak');
            return;
        }
        this.hp -= amount;
        this.invTimer = 1.5;
        Camera.shake(8, 0.3);
        Audio.play('damage');
        Particles.emit(this.x, this.y, 10, 'hit');
        if (this.hp <= 0) {
            this.alive = false;
            Particles.emit(this.x, this.y, 40, 'explode');
            Audio.play('explode');
        }
    },

    addEffect(type, duration) {
        const existing = this.activeEffects.find(e => e.type === type);
        if (existing) {
            existing.timer = duration;
            return;
        }
        this.activeEffects.push({ type, timer: duration });
        this.applyEffect(type, true);
    },

    applyEffect(type, on) {
        switch (type) {
            case 'rapid_fire': this.fireRateMult = on ? 2 : 1; break;
            case 'spread_shot': this.spreadShot = on; break;
            case 'piercing': this.piercing = on; break;
            case 'speed_boost': this.speedMult = on ? 1.5 : 1; break;
            case 'shield': if (on) this.shieldHits = 3; break;
        }
    },

    removeEffect(type) {
        this.applyEffect(type, false);
    },

    render(ctx) {
        if (!this.alive) return;
        if (this.invTimer > 0 && Math.floor(this.invTimer * 10) % 2 === 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.shieldHits > 0) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 8, 0, Utils.PI2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#0cf';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-12, -10);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();
    }
};
