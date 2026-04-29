const HUD = {
    render(ctx, canvasW, canvasH) {
        this.renderHealth(ctx, 20, 20);
        this.renderScore(ctx, canvasW - 20, 20);
        this.renderCoins(ctx, canvasW - 20, 45);
        this.renderWave(ctx, canvasW / 2, 20);
        this.renderPowerups(ctx, 20, 60);
        if (Boss.active && Boss.active.alive) {
            this.renderBossBar(ctx, canvasW);
        }
        this.renderMinimap(ctx, canvasW, canvasH);
    },

    renderHealth(ctx, x, y) {
        const pipSize = 16;
        const gap = 4;
        for (let i = 0; i < Player.maxHp; i++) {
            const px = x + i * (pipSize + gap);
            if (i < Player.hp) {
                const flash = Player.invTimer > 0 && Math.floor(Player.invTimer * 10) % 2 === 0;
                ctx.fillStyle = flash ? '#ff0' : '#0f0';
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 4;
            } else {
                ctx.fillStyle = '#333';
                ctx.shadowBlur = 0;
            }
            ctx.fillRect(px, y, pipSize, pipSize);
            if (i < Player.hp) {
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 1;
                ctx.strokeRect(px, y, pipSize, pipSize);
            }
        }
        ctx.shadowBlur = 0;
    },

    renderScore(ctx, x, y) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(Math.floor(Game.score).toString().padStart(8, '0'), x, y);
    },

    renderCoins(ctx, x, y) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(`$${Game.coins}`, x, y);
    },

    renderWave(ctx, x, y) {
        if (!Spawner.levelDef) return;
        ctx.fillStyle = '#888';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const text = `WAVE ${Spawner.currentWave}/${Spawner.totalWaves}`;
        ctx.fillText(text, x, y);
    },

    renderPowerups(ctx, x, y) {
        for (let i = 0; i < Player.activeEffects.length; i++) {
            const eff = Player.activeEffects[i];
            const t = PowerUps.TYPES[eff.type];
            if (!t) continue;
            const px = x + i * 40;
            ctx.fillStyle = `rgb(${t.r},${t.g},${t.b})`;
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(t.label, px, y);

            const barW = 30;
            const ratio = Math.min(eff.timer / 10, 1);
            ctx.fillStyle = '#333';
            ctx.fillRect(px, y + 16, barW, 3);
            ctx.fillStyle = `rgb(${t.r},${t.g},${t.b})`;
            ctx.fillRect(px, y + 16, barW * ratio, 3);
        }

        if (Player.shieldHits > 0) {
            const px = x + Player.activeEffects.length * 40;
            ctx.fillStyle = '#0ff';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('O x' + Player.shieldHits, px, y);
        }
    },

    renderBossBar(ctx, canvasW) {
        const b = Boss.active;
        const barW = canvasW * 0.6;
        const barH = 8;
        const x = (canvasW - barW) / 2;
        const y = 50;
        const ratio = b.hp / b.maxHp;

        ctx.fillStyle = '#222';
        ctx.fillRect(x, y, barW, barH);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(x, y, barW * ratio, barH);
        ctx.shadowBlur = 0;

        ctx.fillStyle = b.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(b.type.toUpperCase(), canvasW / 2, y - 4);

        for (const phase of b.phases) {
            const px = x + barW * phase.threshold;
            ctx.fillStyle = '#fff';
            ctx.fillRect(px - 1, y - 2, 2, barH + 4);
        }
    },

    renderMinimap(ctx, canvasW, canvasH) {
        const mmW = 120, mmH = 120;
        const mx = canvasW - mmW - 10;
        const my = canvasH - mmH - 10;
        const sx = mmW / Utils.WORLD_W;
        const sy = mmH / Utils.WORLD_H;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(mx, my, mmW, mmH);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.strokeRect(mx, my, mmW, mmH);

        ctx.fillStyle = '#0ff';
        ctx.fillRect(mx + Player.x * sx - 1.5, my + Player.y * sy - 1.5, 3, 3);

        ctx.fillStyle = '#f44';
        for (const e of Enemies.list) {
            ctx.fillRect(mx + e.x * sx - 1, my + e.y * sy - 1, 2, 2);
        }

        if (Boss.active && Boss.active.alive) {
            ctx.fillStyle = Boss.active.color;
            ctx.fillRect(mx + Boss.active.x * sx - 3, my + Boss.active.y * sy - 3, 6, 6);
        }
    }
};
