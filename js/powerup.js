const PowerUps = {
    list: [],
    TYPES: {
        health:      { r: 0, g: 255, b: 80,   label: '+', dropRate: 0.10 },
        rapid_fire:  { r: 255, g: 220, b: 0,   label: 'R', dropRate: 0.08 },
        spread_shot: { r: 80, g: 160, b: 255,  label: 'S', dropRate: 0.06 },
        shield:      { r: 0, g: 255, b: 255,   label: 'O', dropRate: 0.05 },
        piercing:    { r: 255, g: 255, b: 255,  label: 'P', dropRate: 0.05 },
        speed_boost: { r: 0, g: 255, b: 150,   label: 'V', dropRate: 0.07 },
        nuke:        { r: 255, g: 60, b: 60,    label: 'N', dropRate: 0.03 }
    },
    bobTimer: 0,

    spawn(x, y, type) {
        this.list.push({
            x, y, type,
            radius: 12,
            life: 15,
            bob: Utils.rand(0, Utils.PI2)
        });
    },

    tryDrop(x, y, enemyType) {
        const rates = { chaser: 0.10, shooter: 0.15, tank: 0.25, dasher: 0.12, splitter: 0.20 };
        const rate = rates[enemyType] || 0.10;
        if (Math.random() > rate) return;
        const types = Object.keys(this.TYPES);
        const weights = types.map(t => this.TYPES[t].dropRate);
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let i = 0; i < types.length; i++) {
            r -= weights[i];
            if (r <= 0) {
                this.spawn(x, y, types[i]);
                return;
            }
        }
        this.spawn(x, y, 'health');
    },

    update(dt) {
        this.bobTimer += dt;
        for (let i = this.list.length - 1; i >= 0; i--) {
            this.list[i].life -= dt;
            if (this.list[i].life <= 0) {
                this.list.splice(i, 1);
            }
        }
    },

    render(ctx) {
        for (const p of this.list) {
            const t = this.TYPES[p.type];
            const bob = Math.sin(this.bobTimer * 3 + p.bob) * 3;
            const alpha = p.life < 3 ? (Math.floor(p.life * 4) % 2 === 0 ? 0.4 : 1) : 1;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y + bob);

            ctx.shadowColor = `rgb(${t.r},${t.g},${t.b})`;
            ctx.shadowBlur = 14;
            ctx.strokeStyle = `rgb(${t.r},${t.g},${t.b})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Utils.PI2);
            ctx.stroke();

            ctx.fillStyle = `rgba(${t.r},${t.g},${t.b},0.3)`;
            ctx.fill();

            ctx.fillStyle = `rgb(${t.r},${t.g},${t.b})`;
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(t.label, 0, 0);

            ctx.shadowBlur = 0;
            ctx.restore();
        }
    },

    clear() {
        this.list = [];
    }
};
