const UI = {
    waveText: '',
    waveTextTimer: 0,
    bossText: '',
    bossTextTimer: 0,
    screenFlash: 0,
    screenFlashColor: '#fff',
    slowMoTimer: 0,

    showWaveText(num) {
        this.waveText = 'WAVE ' + num;
        this.waveTextTimer = 2;
    },

    showBossIntro(name) {
        this.bossText = name;
        this.bossTextTimer = 3;
    },

    flash(color, duration) {
        this.screenFlashColor = color;
        this.screenFlash = duration || 0.3;
    },

    slowMo(duration) {
        this.slowMoTimer = duration;
    },

    update(dt) {
        if (this.waveTextTimer > 0) this.waveTextTimer -= dt;
        if (this.bossTextTimer > 0) this.bossTextTimer -= dt;
        if (this.screenFlash > 0) this.screenFlash -= dt;
        if (this.slowMoTimer > 0) this.slowMoTimer -= dt;
    },

    getTimeScale() {
        if (this.slowMoTimer > 0) return 0.3;
        return 1;
    },

    renderTitleScreen(ctx, w, h) {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, w, h);

        const t = Date.now() / 1000;
        for (let i = 0; i < 80; i++) {
            const sx = (Math.sin(i * 1.7 + t * 0.2) * 0.5 + 0.5) * w;
            const sy = (Math.cos(i * 2.3 + t * 0.15) * 0.5 + 0.5) * h;
            const alpha = 0.3 + Math.sin(i + t) * 0.2;
            ctx.fillStyle = `rgba(100,150,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.5, 0, Utils.PI2);
            ctx.fill();
        }

        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#0cf';
        ctx.font = 'bold 64px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VOID STRIKER', w / 2, h / 2 - 40);
        ctx.shadowBlur = 0;

        const pulse = 0.4 + Math.sin(t * 3) * 0.3;
        ctx.fillStyle = `rgba(200,220,255,${pulse})`;
        ctx.font = '18px monospace';
        ctx.fillText('Click to Start', w / 2, h / 2 + 40);

        ctx.fillStyle = '#555';
        ctx.font = '14px monospace';
        ctx.fillText('WASD - Move  |  Mouse - Aim & Shoot  |  ESC - Pause', w / 2, h / 2 + 90);
    },

    renderPauseScreen(ctx, w, h) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', w / 2, h / 2 - 20);

        ctx.fillStyle = '#888';
        ctx.font = '18px monospace';
        ctx.fillText('Press ESC to resume', w / 2, h / 2 + 30);
    },

    renderGameOverScreen(ctx, w, h) {
        ctx.fillStyle = 'rgba(10,0,0,0.8)';
        ctx.fillRect(0, 0, w, h);

        ctx.shadowColor = '#f44';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#f44';
        ctx.font = 'bold 56px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 50);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('SCORE: ' + Math.floor(Game.score), w / 2, h / 2 + 10);

        const pulse = 0.4 + Math.sin(Date.now() / 1000 * 3) * 0.3;
        ctx.fillStyle = `rgba(200,200,200,${pulse})`;
        ctx.font = '18px monospace';
        ctx.fillText('Click to Restart', w / 2, h / 2 + 60);
    },

    renderVictoryScreen(ctx, w, h) {
        ctx.fillStyle = 'rgba(0,5,15,0.8)';
        ctx.fillRect(0, 0, w, h);

        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#0ff';
        ctx.font = 'bold 56px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VICTORY', w / 2, h / 2 - 50);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('FINAL SCORE: ' + Math.floor(Game.score), w / 2, h / 2 + 10);

        const pulse = 0.4 + Math.sin(Date.now() / 1000 * 3) * 0.3;
        ctx.fillStyle = `rgba(200,200,200,${pulse})`;
        ctx.font = '18px monospace';
        ctx.fillText('Click to Play Again', w / 2, h / 2 + 60);
    },

    renderOverlayTexts(ctx, w, h) {
        if (this.waveTextTimer > 0) {
            const t = this.waveTextTimer;
            const alpha = t > 1.5 ? (2 - t) * 2 : Math.min(t / 0.3, 1);
            const scale = t > 1.5 ? 1 + (2 - t) * 0.3 : 1;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(w / 2, h / 2);
            ctx.scale(scale, scale);
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 48px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.waveText, 0, 0);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        if (this.bossTextTimer > 0) {
            const t = this.bossTextTimer;
            const alpha = t > 2 ? (3 - t) : Math.min(t / 0.5, 1);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.shadowColor = '#f44';
            ctx.shadowBlur = 25;
            ctx.fillStyle = '#f44';
            ctx.font = 'bold 52px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.bossText, w / 2, h / 2);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        if (this.screenFlash > 0) {
            const alpha = this.screenFlash / 0.3;
            ctx.fillStyle = this.screenFlashColor;
            ctx.globalAlpha = alpha * 0.4;
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 1;
        }
    }
};
