const Spawner = {
    currentWave: 0,
    totalWaves: 0,
    waveDelay: 0,
    spawning: false,
    spawnQueue: [],
    spawnTimer: 0,
    waveClear: false,
    levelDef: null,
    bossSpawned: false,

    loadLevel(levelDef) {
        this.levelDef = levelDef;
        this.currentWave = 0;
        this.totalWaves = levelDef.waves.length;
        this.waveDelay = 2;
        this.spawning = false;
        this.spawnQueue = [];
        this.bossSpawned = false;
        this.waveClear = false;
    },

    update(dt) {
        if (!this.levelDef) return;

        if (this.waveDelay > 0) {
            this.waveDelay -= dt;
            if (this.waveDelay <= 0 && this.currentWave < this.totalWaves) {
                this.startWave(this.currentWave);
            }
            return;
        }

        if (this.spawning) {
            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0 && this.spawnQueue.length > 0) {
                const item = this.spawnQueue.shift();
                const edge = Utils.randInt(0, 3);
                let x, y;
                switch (edge) {
                    case 0: x = Utils.rand(50, Utils.WORLD_W - 50); y = -30; break;
                    case 1: x = Utils.WORLD_W + 30; y = Utils.rand(50, Utils.WORLD_H - 50); break;
                    case 2: x = Utils.rand(50, Utils.WORLD_W - 50); y = Utils.WORLD_H + 30; break;
                    default: x = -30; y = Utils.rand(50, Utils.WORLD_H - 50); break;
                }
                Enemies.spawn(item.type, x, y);
                this.spawnTimer = 0.3;
            }
            if (this.spawnQueue.length === 0) {
                this.spawning = false;
            }
            return;
        }

        const enemiesAlive = Enemies.list.length;
        const bossAlive = Boss.active && Boss.active.alive;

        if (enemiesAlive === 0 && !bossAlive && !this.spawning) {
            if (this.currentWave >= this.totalWaves) {
                if (this.levelDef.boss && !this.bossSpawned) {
                    this.bossSpawned = true;
                    Boss.spawn(this.levelDef.boss);
                    UI.showBossIntro(this.levelDef.bossName || 'BOSS');
                } else if (!Boss.active || !Boss.active.alive) {
                    this.waveClear = true;
                }
            } else {
                this.currentWave++;
                this.waveDelay = 2;
            }
        }
    },

    startWave(index) {
        const wave = this.levelDef.waves[index];
        this.spawnQueue = [];
        for (const entry of wave) {
            for (let i = 0; i < entry.count; i++) {
                this.spawnQueue.push({ type: entry.type });
            }
        }
        for (let i = this.spawnQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.spawnQueue[i], this.spawnQueue[j]] = [this.spawnQueue[j], this.spawnQueue[i]];
        }
        this.spawning = true;
        this.spawnTimer = 0;
        UI.showWaveText(index + 1);
    },

    clear() {
        this.levelDef = null;
        this.currentWave = 0;
        this.spawning = false;
        this.spawnQueue = [];
        this.bossSpawned = false;
        this.waveClear = false;
    }
};
