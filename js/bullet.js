const Bullets = {
    pool: [],
    activeCount: 0,
    POOL_SIZE: 300,

    init() {
        for (let i = 0; i < this.POOL_SIZE; i++) {
            this.pool.push({ alive: false, x: 0, y: 0, vx: 0, vy: 0, damage: 1, ownerType: 'player', radius: 4, life: 2, piercing: false, pierceCount: 0, trail: [] });
        }
    },

    spawn(x, y, vx, vy, ownerType, damage, piercing) {
        if (this.activeCount >= this.POOL_SIZE) return;
        const b = this.pool[this.activeCount];
        b.alive = true;
        b.x = x;
        b.y = y;
        b.vx = vx;
        b.vy = vy;
        b.damage = damage;
        b.ownerType = ownerType;
        b.life = 2.5;
        b.piercing = !!piercing;
        b.pierceCount = piercing ? 3 : 0;
        b.trail = [];
        this.activeCount++;
    },

    update(dt) {
        for (let i = this.activeCount - 1; i >= 0; i--) {
            const b = this.pool[i];
            b.life -= dt;
            if (b.life <= 0 || b.x < -50 || b.x > Utils.WORLD_W + 50 || b.y < -50 || b.y > Utils.WORLD_H + 50) {
                this._remove(i);
                continue;
            }
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 5) b.trail.shift();
            b.x += b.vx * dt;
            b.y += b.vy * dt;
        }
    },

    _remove(i) {
        const b = this.pool[i];
        b.alive = false;
        this.activeCount--;
        const last = this.pool[this.activeCount];
        if (i < this.activeCount) {
            this.pool[i] = last;
            this.pool[this.activeCount] = b;
        }
    },

    removeAt(i) {
        this._remove(i);
    },

    render(ctx) {
        for (let i = 0; i < this.activeCount; i++) {
            const b = this.pool[i];
            const isPlayer = b.ownerType === 'player';
            const color = isPlayer ? '#0ff' : '#f44';
            const glow = isPlayer ? '#0af' : '#f00';

            if (b.trail.length > 1) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(b.trail[0].x, b.trail[0].y);
                for (let j = 1; j < b.trail.length; j++) {
                    ctx.lineTo(b.trail[j].x, b.trail[j].y);
                }
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            ctx.shadowColor = glow;
            ctx.shadowBlur = 8;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Utils.PI2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};
