const Audio = {
    ctx: null,
    masterGain: null,
    enabled: false,

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
        this.enabled = true;
    },

    play(name) {
        if (!this.enabled || !this.ctx) return;
        const fn = this.sounds[name];
        if (fn) fn.call(this);
    },

    _osc(type, freq, freqEnd, duration, volume) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + duration);
    },

    _noise(duration, volume) {
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        src.buffer = buffer;
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        src.connect(gain);
        gain.connect(this.masterGain);
        src.start(t);
        src.stop(t + duration);
    },

    sounds: {
        shoot() {
            this._osc('square', 800, 200, 0.05, 0.15);
        },
        hit() {
            this._noise(0.08, 0.2);
        },
        explode() {
            this._osc('sine', 200, 30, 0.3, 0.3);
            this._noise(0.15, 0.15);
        },
        powerup() {
            const t = this.ctx.currentTime;
            [400, 500, 600, 800].forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = f;
                gain.gain.setValueAtTime(0.15, t + i * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.1);
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(t + i * 0.05);
                osc.stop(t + i * 0.05 + 0.12);
            });
        },
        damage() {
            this._osc('sawtooth', 300, 80, 0.15, 0.25);
            this._noise(0.06, 0.1);
        },
        boss_alert() {
            this._osc('sawtooth', 80, 60, 0.5, 0.2);
        }
    }
};
