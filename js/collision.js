const Collision = {
    cellSize: 80,
    grid: {},

    clear() {
        this.grid = {};
    },

    _key(cx, cy) {
        return cx + cy * 10000;
    },

    insert(entity) {
        const r = entity.radius || 10;
        const x1 = Math.floor((entity.x - r) / this.cellSize);
        const y1 = Math.floor((entity.y - r) / this.cellSize);
        const x2 = Math.floor((entity.x + r) / this.cellSize);
        const y2 = Math.floor((entity.y + r) / this.cellSize);
        for (let cx = x1; cx <= x2; cx++) {
            for (let cy = y1; cy <= y2; cy++) {
                const key = this._key(cx, cy);
                if (!this.grid[key]) this.grid[key] = [];
                this.grid[key].push(entity);
            }
        }
    },

    query(entity) {
        const r = entity.radius || 10;
        const x1 = Math.floor((entity.x - r) / this.cellSize);
        const y1 = Math.floor((entity.y - r) / this.cellSize);
        const x2 = Math.floor((entity.x + r) / this.cellSize);
        const y2 = Math.floor((entity.y + r) / this.cellSize);
        const results = [];
        const seen = new Set();
        for (let cx = x1; cx <= x2; cx++) {
            for (let cy = y1; cy <= y2; cy++) {
                const key = this._key(cx, cy);
                const cell = this.grid[key];
                if (!cell) continue;
                for (let i = 0; i < cell.length; i++) {
                    const e = cell[i];
                    if (e === entity || seen.has(e)) continue;
                    seen.add(e);
                    results.push(e);
                }
            }
        }
        return results;
    },

    circleCircle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = a.radius + b.radius;
        return dx * dx + dy * dy < dist * dist;
    },

    circleRect(cx, cy, cr, rx, ry, rw, rh) {
        const nearX = Utils.clamp(cx, rx, rx + rw);
        const nearY = Utils.clamp(cy, ry, ry + rh);
        const dx = cx - nearX;
        const dy = cy - nearY;
        return dx * dx + dy * dy < cr * cr;
    }
};
