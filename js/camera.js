const Camera = {
    x: 0, y: 0,
    halfW: 0, halfH: 0,
    shakeX: 0, shakeY: 0,
    shakeIntensity: 0, shakeDuration: 0, shakeTimer: 0,
    zoom: 1,

    init(canvasW, canvasH) {
        this.halfW = canvasW / 2;
        this.halfH = canvasH / 2;
    },

    follow(target, dt) {
        const speed = 5 * dt;
        this.x = Utils.lerp(this.x, target.x, speed);
        this.y = Utils.lerp(this.y, target.y, speed);
        this.x = Utils.clamp(this.x, this.halfW, Utils.WORLD_W - this.halfW);
        this.y = Utils.clamp(this.y, this.halfH, Utils.WORLD_H - this.halfH);
    },

    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = duration;
    },

    update(dt) {
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            const t = this.shakeTimer / this.shakeDuration;
            const mag = this.shakeIntensity * t;
            this.shakeX = Utils.rand(-mag, mag);
            this.shakeY = Utils.rand(-mag, mag);
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
        }
    },

    apply(ctx) {
        ctx.save();
        const ox = this.x - this.halfW + this.shakeX;
        const oy = this.y - this.halfH + this.shakeY;
        ctx.translate(-ox, -oy);
    },

    restore(ctx) {
        ctx.restore();
    },

    worldToScreen(wx, wy) {
        return {
            x: wx - this.x + this.halfW + this.shakeX,
            y: wy - this.y + this.halfH + this.shakeY
        };
    },

    screenToWorld(sx, sy) {
        return {
            x: sx + this.x - this.halfW - this.shakeX,
            y: sy + this.y - this.halfH - this.shakeY
        };
    }
};
