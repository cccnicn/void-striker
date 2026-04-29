const Upgrades = {
    list: {
        speed: {
            name: 'Speed',
            description: 'Move faster',
            maxLevel: 5,
            baseCost: 100,
            costMultiplier: 1.5,
            getValue(level) { return 1.0 + level * 0.15; }
        },
        fireRate: {
            name: 'Fire Rate',
            description: 'Shoot faster',
            maxLevel: 5,
            baseCost: 150,
            costMultiplier: 1.6,
            getValue(level) { return 1.0 + level * 0.2; }
        },
        damage: {
            name: 'Damage',
            description: 'Deal more damage',
            maxLevel: 5,
            baseCost: 200,
            costMultiplier: 1.7,
            getValue(level) { return 1.0 + level * 0.25; }
        },
        maxHp: {
            name: 'Max HP',
            description: 'More health',
            maxLevel: 5,
            baseCost: 250,
            costMultiplier: 1.8,
            getValue(level) { return 5 + level * 1; }
        },
        pickupRange: {
            name: 'Pickup Range',
            description: 'Collect power-ups from farther',
            maxLevel: 3,
            baseCost: 100,
            costMultiplier: 1.5,
            getValue(level) { return 1.0 + level * 0.5; }
        }
    },

    getCost(type, level) {
        const upg = this.list[type];
        if (!upg || level >= upg.maxLevel) return Infinity;
        return Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, level));
    },

    canAfford(type, level, coins) {
        return coins >= this.getCost(type, level);
    },

    isMaxed(type, level) {
        const upg = this.list[type];
        return level >= upg.maxLevel;
    },

    load() {
        const saved = localStorage.getItem('voidStriker_upgrades');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return this.getDefault();
            }
        }
        return this.getDefault();
    },

    save(upgrades) {
        localStorage.setItem('voidStriker_upgrades', JSON.stringify(upgrades));
    },

    getDefault() {
        const def = {};
        for (const key in this.list) {
            def[key] = 0;
        }
        return def;
    },

    applyToPlayer(upgrades) {
        Player.speedMult = this.list.speed.getValue(upgrades.speed);
        Player.fireRateMult = this.list.fireRate.getValue(upgrades.fireRate);
        Player.damageMult = this.list.damage.getValue(upgrades.damage);
        Player.maxHp = this.list.maxHp.getValue(upgrades.maxHp);
        Player.pickupRange = this.list.pickupRange.getValue(upgrades.pickupRange);
    }
};
