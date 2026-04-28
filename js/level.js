const Levels = {
    list: [
        {
            name: 'Void Arena',
            worldW: 3000, worldH: 3000,
            bgColor: '#0a0a1a',
            bgStyle: 'nebula',
            obstacles: [],
            waves: [
                [{ type: 'chaser', count: 5 }],
                [{ type: 'chaser', count: 8 }],
                [{ type: 'chaser', count: 5 }, { type: 'shooter', count: 2 }],
                [{ type: 'shooter', count: 4 }, { type: 'chaser', count: 4 }],
                [{ type: 'chaser', count: 6 }, { type: 'dasher', count: 3 }],
                [{ type: 'shooter', count: 4 }, { type: 'dasher', count: 3 }, { type: 'chaser', count: 4 }]
            ],
            boss: 'sentinel',
            bossName: 'THE SENTINEL'
        },
        {
            name: 'Neon Grid',
            worldW: 3000, worldH: 3000,
            bgColor: '#050510',
            bgStyle: 'grid',
            obstacles: [
                { x: 600, y: 600, w: 40, h: 400 },
                { x: 1200, y: 800, w: 400, h: 40 },
                { x: 2000, y: 400, w: 40, h: 600 },
                { x: 800, y: 1800, w: 500, h: 40 },
                { x: 2200, y: 1600, w: 40, h: 500 },
                { x: 1400, y: 2200, w: 400, h: 40 },
                { x: 400, y: 2400, w: 40, h: 300 },
                { x: 2600, y: 1000, w: 300, h: 40 }
            ],
            waves: [
                [{ type: 'shooter', count: 5 }, { type: 'chaser', count: 3 }],
                [{ type: 'tank', count: 2 }, { type: 'chaser', count: 6 }],
                [{ type: 'dasher', count: 5 }, { type: 'shooter', count: 3 }],
                [{ type: 'splitter', count: 3 }, { type: 'chaser', count: 5 }],
                [{ type: 'tank', count: 3 }, { type: 'shooter', count: 4 }, { type: 'dasher', count: 3 }],
                [{ type: 'splitter', count: 4 }, { type: 'dasher', count: 4 }, { type: 'shooter', count: 4 }],
                [{ type: 'tank', count: 2 }, { type: 'splitter', count: 3 }, { type: 'dasher', count: 5 }, { type: 'chaser', count: 8 }]
            ],
            boss: 'hive',
            bossName: 'THE HIVE'
        },
        {
            name: 'The Core',
            worldW: 3000, worldH: 3000,
            bgColor: '#100505',
            bgStyle: 'pulse',
            obstacles: [
                { x: 1000, y: 1000, w: 1000, h: 40 },
                { x: 1000, y: 1960, w: 1000, h: 40 },
                { x: 1000, y: 1000, w: 40, h: 1000 },
                { x: 1960, y: 1000, w: 40, h: 1000 },
                { x: 400, y: 400, w: 40, h: 300 },
                { x: 400, y: 400, w: 300, h: 40 },
                { x: 2560, y: 400, w: 40, h: 300 },
                { x: 2300, y: 400, w: 300, h: 40 },
                { x: 400, y: 2300, w: 300, h: 40 },
                { x: 400, y: 2060, w: 40, h: 300 },
                { x: 2300, y: 2300, w: 300, h: 40 },
                { x: 2560, y: 2060, w: 40, h: 300 }
            ],
            waves: [
                [{ type: 'chaser', count: 10 }, { type: 'dasher', count: 5 }],
                [{ type: 'tank', count: 4 }, { type: 'splitter', count: 3 }],
                [{ type: 'shooter', count: 6 }, { type: 'dasher', count: 6 }],
                [{ type: 'splitter', count: 5 }, { type: 'tank', count: 3 }, { type: 'chaser', count: 8 }],
                [{ type: 'dasher', count: 8 }, { type: 'shooter', count: 6 }, { type: 'tank', count: 2 }],
                [{ type: 'splitter', count: 6 }, { type: 'tank', count: 4 }, { type: 'dasher', count: 6 }, { type: 'chaser', count: 10 }],
                [{ type: 'tank', count: 5 }, { type: 'splitter', count: 5 }, { type: 'shooter', count: 8 }, { type: 'dasher', count: 8 }, { type: 'chaser', count: 12 }]
            ],
            boss: 'annihilator',
            bossName: 'THE ANNIHILATOR'
        }
    ]
};
