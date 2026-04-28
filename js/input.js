const Input = {
    keys: {},
    keysJustPressed: {},
    mouse: { x: 0, y: 0, worldX: 0, worldY: 0, down: false, clicked: false },
    _frameKeys: {},
    _frameClicked: false,
    _canvas: null,

    init(canvas) {
        this._canvas = canvas;

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) this._frameKeys[e.code] = true;
            this.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.mouse.down = true;
                this._frameClicked = true;
            }
        });

        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.down = false;
        });

        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    update(camera) {
        this.keysJustPressed = { ...this._frameKeys };
        this._frameKeys = {};
        this.mouse.clicked = this._frameClicked;
        this._frameClicked = false;

        if (camera) {
            this.mouse.worldX = this.mouse.x + camera.x - camera.halfW;
            this.mouse.worldY = this.mouse.y + camera.y - camera.halfH;
        }
    },

    isDown(code) { return !!this.keys[code]; },
    justPressed(code) { return !!this.keysJustPressed[code]; }
};
