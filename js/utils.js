const Utils = {
    WORLD_W: 3000,
    WORLD_H: 3000,
    PI2: Math.PI * 2,
    DEG: Math.PI / 180,

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    clamp(v, min, max) {
        return v < min ? min : v > max ? max : v;
    },

    rand(min, max) {
        return min + Math.random() * (max - min);
    },

    randInt(min, max) {
        return Math.floor(Utils.rand(min, max + 1));
    },

    randSign() {
        return Math.random() < 0.5 ? -1 : 1;
    },

    dist(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distSq(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    },

    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    normalize(x, y) {
        const len = Math.sqrt(x * x + y * y);
        if (len === 0) return { x: 0, y: 0 };
        return { x: x / len, y: y / len };
    },

    rotatePoint(x, y, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return { x: x * c - y * s, y: x * s + y * c };
    }
};
