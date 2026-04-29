const Boss = {
    active: null,

    spawn(type) {
        const cx = Utils.WORLD_W / 2;
        const cy = Utils.WORLD_H / 2;
        const b = {
            x: cx, y: 150, vx: 0, vy: 0,
            angle: 0, alive: true, type,
            radius: 50, hp: 0, maxHp: 0,
            phase: 0, phases: [],
            attackTimer: 0, moveTimer: 0,
            invTimer: 0.8,
            spiralAngle: 0,
            chargeTarget: null, isCharging: false, chargeTimer: 0,
            spawnTimer: 0, color: '#f80'
        };

        switch (type) {
            case 'sentinel':
                b.maxHp = 80; b.hp = 80; b.color = '#f80';
                b.phases = [
                    { threshold: 1.0, attacks: ['spiral', 'aimedBurst'], speed: 40, color: '#f80' },
                    { threshold: 0.5, attacks: ['spiral', 'aimedBurst', 'burstRing'], speed: 60, color: '#f44' }
                ];
                break;
            case 'hive':
                b.maxHp = 120; b.hp = 120; b.color = '#0f0';
                b.phases = [
                    { threshold: 1.0, attacks: ['spawnMinions', 'aimedBurst'], speed: 30, color: '#0f0' },
                    { threshold: 0.6, attacks: ['spawnMinions', 'burstRing'], speed: 40, color: '#a0f' },
                    { threshold: 0.3, attacks: ['spiral', 'spawnMinions', 'burstRing', 'aimedBurst'], speed: 50, color: '#f44' }
                ];
                break;
            case 'annihilator':
                b.maxHp = 180; b.hp = 180; b.color = '#44f';
                b.phases = [
                    { threshold: 1.0, attacks: ['spiral', 'charge'], speed: 50, color: '#44f' },
                    { threshold: 0.5, attacks: ['spiral', 'charge', 'burstRing', 'laserSweep'], speed: 70, color: '#fff' },
                    { threshold: 0.25, attacks: ['spiral', 'charge', 'burstRing', 'aimedBurst', 'laserSweep'], speed: 90, color: '#f22' }
                ];
                break;
        }
        this.active = b;
        Camera.shake(12, 1);
        Audio.play('boss_alert');
    },

    update(dt) {
        const b = this.active;
        if (!b || !b.alive) return;

        if (b.invTimer > 0) { b.invTimer -= dt; return; }

        const phaseIdx = this._getPhase(b);
        if (phaseIdx !== b.phase) {
            b.phase = phaseIdx;
            b.color = b.phases[phaseIdx].color;
            b.invTimer = 0.5;
            Camera.shake(6, 0.3);
            Particles.emit(b.x, b.y, 20, 'nuke');
        }

        const phase = b.phases[phaseIdx];
        this._move(b, dt, phase.speed);

        b.attackTimer -= dt;
        if (b.attackTimer <= 0) {
            const atk = phase.attacks[Math.floor(Math.random() * phase.attacks.length)];
            this._attack(b, atk);
            b.attackTimer = 0.4 + Math.random() * 0.6;
        }

        b.x = Utils.clamp(b.x, b.radius, Utils.WORLD_W - b.radius);
        b.y = Utils.clamp(b.y, b.radius, Utils.WORLD_H - b.radius);
        Game.checkObstacleCollision(b);

        b.spiralAngle += dt * 3;
        b.angle += dt * 0.5;
    },

    _getPhase(b) {
        const ratio = b.hp / b.maxHp;
        for (let i = b.phases.length - 1; i >= 0; i--) {
            if (ratio <= b.phases[i].threshold) return i;
        }
        return 0;
    },

    _move(b, dt, speed) {
        if (b.isCharging) {
            b.chargeTimer -= dt;
            if (b.chargeTimer <= 0) b.isCharging = false;
            return;
        }
        const px = Player.x, py = Player.y;
        const dx = px - b.x, dy = py - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 200;
        if (dist > targetDist + 50) {
            b.vx = (dx / dist) * speed;
            b.vy = (dy / dist) * speed;
        } else if (dist < targetDist - 50) {
            b.vx = -(dx / dist) * speed;
            b.vy = -(dy / dist) * speed;
        } else {
            const perp = Utils.rand(-1, 1);
            b.vx = (-dy / dist) * speed * perp;
            b.vy = (dx / dist) * speed * perp;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
    },

    _attack(b, type) {
        const px = Player.x, py = Player.y;
        switch (type) {
            case 'spiral': {
                const spd = 200;
                for (let i = 0; i < 3; i++) {
                    const ang = b.spiralAngle + Utils.PI2 / 3 * i;
                    Bullets.spawn(b.x, b.y, Math.cos(ang) * spd, Math.sin(ang) * spd, 'enemy', 1, false);
                }
                break;
            }
            case 'aimedBurst': {
                const ang = Utils.angle(b.x, b.y, px, py);
                const spd = 300;
                for (let i = -1; i <= 1; i++) {
                    const a = ang + i * 10 * Utils.DEG;
                    Bullets.spawn(b.x, b.y, Math.cos(a) * spd, Math.sin(a) * spd, 'enemy', 1, false);
                }
                break;
            }
            case 'burstRing': {
                const count = 14;
                const spd = 180;
                for (let i = 0; i < count; i++) {
                    const a = Utils.PI2 / count * i;
                    Bullets.spawn(b.x, b.y, Math.cos(a) * spd, Math.sin(a) * spd, 'enemy', 1, false);
                }
                break;
            }
            case 'spawnMinions': {
                for (let i = 0; i < 3; i++) {
                    const a = Utils.rand(0, Utils.PI2);
                    const r = Utils.rand(40, 80);
                    Enemies.spawn('chaser', b.x + Math.cos(a) * r, b.y + Math.sin(a) * r);
                }
                break;
            }
            case 'charge': {
                b.isCharging = true;
                b.chargeTimer = 0.4;
                const ang = Utils.angle(b.x, b.y, px, py);
                b.vx = Math.cos(ang) * 500;
                b.vy = Math.sin(ang) * 500;
                b.x += b.vx * 0.016;
                b.y += b.vy * 0.016;
                break;
            }
            case 'laserSweep': {
                const baseAngle = Utils.angle(b.x, b.y, px, py);
                const spd = 220;
                for (let i = -3; i <= 3; i++) {
                    const a = baseAngle + i * 12 * Utils.DEG;
                    Bullets.spawn(b.x, b.y, Math.cos(a) * spd, Math.sin(a) * spd, 'enemy', 1, false);
                }
                break;
            }
        }
    },

    damage(amount) {
        const b = this.active;
        if (!b || !b.alive || b.invTimer > 0) return;
        b.hp -= amount;
        Particles.emit(b.x, b.y, 8, 'enemyHit');
        Audio.play('hit');
        if (b.hp <= 0) {
            b.alive = false;
            Particles.emit(b.x, b.y, 60, 'nuke');
            Particles.emit(b.x, b.y, 40, 'explode');
            Audio.play('explode');
            Camera.shake(15, 0.8);
            Game.score += 500;
        }
    },

    render(ctx) {
        const b = this.active;
        if (!b || !b.alive) return;

        if (b.invTimer > 0 && Math.floor(b.invTimer * 10) % 2 === 0) return;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);

        ctx.shadowColor = b.color;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 3;
        ctx.fillStyle = b.color + '30';

        const outerR = b.radius;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = Utils.PI2 / 6 * i;
            const px = Math.cos(a) * outerR;
            const py = Math.sin(a) * outerR;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const innerR = outerR * 0.55;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = Utils.PI2 / 6 * i + Math.PI / 6;
            const px = Math.cos(a) * innerR;
            const py = Math.sin(a) * innerR;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
    },

    clear() {
        this.active = null;
    }
};
