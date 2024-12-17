import { Scene } from 'phaser';

export class Preloader extends Scene
{
    rows = 3;
    cols = 5;
    itemCount = 13
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('items', 'items.png');
        this.load.image('slotback', 'slotmachine.png');
        this.load.image('rectangles', 'rectangles.png');
        this.load.image('bottle', 'bottle.png')
        this.load.image('backgroud', 'back.png')
        this.load.image('helmet', 'helmet.png')
    }

    create ()
    {
        let initLayer = [];
        for(let i = 0; i < this.rows; i++) {
            initLayer.push([]);
            for(let j = 0; j < this.cols; j++)
            {
                initLayer[i][j] = Math.floor(Math.random() * this.itemCount);
            }
        }
        this.scene.start('Game', { initLayer });
    }
}
