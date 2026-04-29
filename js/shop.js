const Shop = {
    visible: false,
    timer: 0,
    autoCloseTime: 10,
    buttons: [],

    show() {
        this.visible = true;
        this.timer = this.autoCloseTime;
        this.buttons = [];
        this._buildButtons();
    },

    hide() {
        this.visible = false;
        this.buttons = [];
    },

    update(dt) {
        if (!this.visible) return;
        this.timer -= dt;
        if (this.timer <= 0) {
            this.hide();
            Game.state = 'playing';
        }
    },

    _buildButtons() {
        const W = Game.W, H = Game.H;
        const startY = H / 2 - 100;
        const btnH = 50;
        const btnW = 300;
        const btnX = W / 2 - btnW / 2;
        let y = startY;

        for (const key in Upgrades.list) {
            const upg = Upgrades.list[key];
            const level = Game.upgrades[key] || 0;
            const cost = Upgrades.getCost(key, level);
            const canBuy = Upgrades.canAfford(key, level, Game.coins);
            const maxed = Upgrades.isMaxed(key, level);

            this.buttons.push({
                type: 'upgrade',
                key,
                x: btnX,
                y,
                w: btnW,
                h: btnH,
                canBuy,
                maxed,
                cost,
                level,
                maxLevel: upg.maxLevel
            });
            y += btnH + 10;
        }

        this.buttons.push({
            type: 'continue',
            x: W / 2 - 80,
            y: y + 20,
            w: 160,
            h: 40
        });
    },

    handleClick(x, y) {
        if (!this.visible) return false;

        for (const btn of this.buttons) {
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                if (btn.type === 'upgrade') {
                    if (btn.canBuy && !btn.maxed) {
                        const cost = Upgrades.getCost(btn.key, btn.level);
                        Game.coins -= cost;
                        Game.upgrades[btn.key] = (Game.upgrades[btn.key] || 0) + 1;
                        Upgrades.save(Game.upgrades);
                        Upgrades.applyToPlayer(Game.upgrades);
                        Audio.play('powerup');
                        this._buildButtons();
                    }
                } else if (btn.type === 'continue') {
                    this.hide();
                    Game.loadLevel(Game.currentLevel + 1);
                }
                return true;
            }
        }
        return false;
    },

    render(ctx, W, H) {
        if (!this.visible) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('SHOP', W / 2, H / 2 - 180);

        ctx.fillStyle = '#ffd700';
        ctx.font = '20px monospace';
        ctx.fillText(`Coins: ${Game.coins}`, W / 2, H / 2 - 140);

        const timerText = `Auto-close in ${Math.ceil(this.timer)}s`;
        ctx.fillStyle = this.timer < 3 ? '#f44' : '#888';
        ctx.font = '14px monospace';
        ctx.fillText(timerText, W / 2, H / 2 - 115);

        for (const btn of this.buttons) {
            if (btn.type === 'upgrade') {
                const upg = Upgrades.list[btn.key];
                const canBuy = btn.canBuy && !btn.maxed;

                ctx.fillStyle = canBuy ? 'rgba(0, 100, 0, 0.6)' : 'rgba(50, 50, 50, 0.6)';
                ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
                ctx.strokeStyle = canBuy ? '#0f0' : '#555';
                ctx.lineWidth = 2;
                ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px monospace';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(`${upg.name} [${btn.level}/${btn.maxLevel}]`, btn.x + 10, btn.y + 8);

                ctx.fillStyle = '#aaa';
                ctx.font = '12px monospace';
                ctx.fillText(upg.description, btn.x + 10, btn.y + 28);

                ctx.textAlign = 'right';
                if (btn.maxed) {
                    ctx.fillStyle = '#0f0';
                    ctx.fillText('MAXED', btn.x + btn.w - 10, btn.y + 8);
                } else {
                    ctx.fillStyle = canBuy ? '#ffd700' : '#f44';
                    ctx.fillText(`$${btn.cost}`, btn.x + btn.w - 10, btn.y + 8);
                }
            } else if (btn.type === 'continue') {
                ctx.fillStyle = 'rgba(0, 80, 150, 0.8)';
                ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
                ctx.strokeStyle = '#0af';
                ctx.lineWidth = 2;
                ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 18px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('CONTINUE', btn.x + btn.w / 2, btn.y + btn.h / 2);
            }
        }
    }
};
