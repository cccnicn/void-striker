const Particles = {
    pool: [],
    activeCount: 0,
    POOL_SIZE: 600,

    init() {
        for (let i = 0; i < this.POOL_SIZE; i++) {
            this.pool.push({ alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, r: 0, g: 0, b: 0, drag: 0 });
        }
    },

    emit(x, y, count, preset) {
        const c = this.presets[preset];
        if (!c) return;
        for (let i = 0; i < count; i++) {
            if (this.activeCount >= this.POOL_SIZE) return;
            const p = this.pool[this.activeCount];
            const ang = Utils.rand(0, Utils.PI2);
            const spd = Utils.rand(c.speedMin, c.speedMax);
            p.alive = true;
            p.x = x + Utils.rand(-2, 2);
            p.y = y + Utils.rand(-2, 2);
            p.vx = Math.cos(ang) * spd;
            p.vy = Math.sin(ang) * spd;
            p.life = Utils.rand(c.lifeMin, c.lifeMax);
            p.maxLife = p.life;
            p.size = Utils.rand(c.sizeMin, c.sizeMax);
            p.r = c.r + Utils.rand(-c.rVar, c.rVar);
            p.g = c.g + Utils.rand(-c.gVar, c.gVar);
            p.b = c.b + Utils.rand(-c.bVar, c.bVar);
            p.drag = c.drag;
            this.activeCount++;
        }
    },

    update(dt) {
        for (let i = this.activeCount - 1; i >= 0; i--) {
            const p = this.pool[i];
            p.life -= dt;
            if (p.life <= 0) {
                p.alive = false;
                this.activeCount--;
                const last = this.pool[this.activeCount];
                if (i < this.activeCount) {
                    this.pool[i] = last;
                    this.pool[this.activeCount] = p;
                }
                continue;
            }
            p.vx *= (1 - p.drag * dt);
            p.vy *= (1 - p.drag * dt);
            p.x += p.vx * dt;
            p.y += p.vy * dt;
        }
    },

    render(ctx) {
        for (let i = 0; i < this.activeCount; i++) {
            const p = this.pool[i];
            const t = p.life / p.maxLife;
            const alpha = t * 0.9;
            const r = Math.floor(Utils.clamp(p.r, 0, 255));
            const g = Math.floor(Utils.clamp(p.g, 0, 255));
            const b = Math.floor(Utils.clamp(p.b, 0, 255));
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * t, 0, Utils.PI2);
            ctx.fill();
        }
    },

    presets: {
        thrust:    { speedMin: 30, speedMax: 80, lifeMin: 0.1, lifeMax: 0.3, sizeMin: 2, sizeMax: 4, r: 100, g: 200, b: 255, rVar: 30, gVar: 40, bVar: 0, drag: 3 },
        muzzle:    { speedMin: 100, speedMax: 200, lifeMin: 0.05, lifeMax: 0.12, sizeMin: 2, sizeMax: 4, r: 150, g: 220, b: 255, rVar: 50, gVar: 30, bVar: 0, drag: 5 },
        hit:       { speedMin: 50, speedMax: 150, lifeMin: 0.1, lifeMax: 0.3, sizeMin: 2, sizeMax: 5, r: 255, g: 200, b: 100, rVar: 0, gVar: 50, bVar: 50, drag: 4 },
        explode:   { speedMin: 60, speedMax: 250, lifeMin: 0.2, lifeMax: 0.6, sizeMin: 2, sizeMax: 7, r: 255, g: 180, b: 50, rVar: 0, gVar: 60, bVar: 30, drag: 3 },
        spark:     { speedMin: 150, speedMax: 300, lifeMin: 0.05, lifeMax: 0.15, sizeMin: 1, sizeMax: 3, r: 255, g: 255, b: 255, rVar: 0, gVar: 0, bVar: 0, drag: 2 },
        enemyHit:  { speedMin: 40, speedMax: 120, lifeMin: 0.1, lifeMax: 0.25, sizeMin: 2, sizeMax: 4, r: 255, g: 100, b: 100, rVar: 0, gVar: 50, bVar: 50, drag: 4 },
        shieldBreak: { speedMin: 80, speedMax: 180, lifeMin: 0.15, lifeMax: 0.4, sizeMin: 2, sizeMax: 5, r: 0, g: 255, b: 255, rVar: 0, gVar: 0, bVar: 30, drag: 3 },
        powerup:   { speedMin: 30, speedMax: 80, lifeMin: 0.2, lifeMax: 0.5, sizeMin: 2, sizeMax: 5, r: 255, g: 255, b: 100, rVar: 0, gVar: 0, bVar: 50, drag: 3 },
        nuke:      { speedMin: 200, speedMax: 500, lifeMin: 0.3, lifeMax: 0.8, sizeMin: 3, sizeMax: 10, r: 255, g: 255, b: 255, rVar: 0, gVar: 0, bVar: 0, drag: 2 },
        green:     { speedMin: 60, speedMax: 200, lifeMin: 0.2, lifeMax: 0.5, sizeMin: 2, sizeMax: 6, r: 80, g: 255, b: 80, rVar: 30, gVar: 0, bVar: 30, drag: 3 }
    }
};
