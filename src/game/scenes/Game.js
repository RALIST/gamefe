import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { CellItem } from '../GameCell';
import  GameStatus from '../GameGenerationStatus'
import  ItemsId from '../GameItemsId'

export class Game extends Scene
{
    CENTER_OFFSET_X = 480;
    CENTER_OFFSET_Y = 140;

    GAME_OFFSET_X = this.CENTER_OFFSET_X + 44;
    GAME_OFFSET_Y = this.CENTER_OFFSET_Y + 140;

    TILE_HEIGHT = 168;
    TILE_WIDTH = 168;

    SPRITE_TILE_WIDTH = 148;
    SPRITE_TILE_HEIGHT = 148;

    GAME_TILES_XN = 5;
    GAME_TILES_YN = 3;

    IS_NEXT_GEN_COMPLETED = true;
    IS_FAST_MODE = false;


    ROLL_SPIN_COUNT = 1;
    ANIMATION_ROLL_STEP_COUNT = 4;
    ANIMATION_ROLL_STEP_Y = this.SPRITE_TILE_HEIGHT / this.ANIMATION_ROLL_STEP_COUNT;

    GAME_TILES_COUNT = this.GAME_TILES_XN * this.GAME_TILES_YN;

    WINLINE_ANIMATION_TIMER = null;
    WINLINE_GRAPHICS = null;

    BONUS_SET_GRAPHICS = null;
    BONUS_SET_CAMERA_ANIMATION = null;


    constructor ()
    {
        super('Game');
    }

    init (data) {
        this.initLayer = data.initLayer;
    }

    create ()
    {
        // send scene to react component
        EventBus.emit('current-scene-ready', this);

        this.BONUS_SET_GRAPHICS = this.add.graphics();
        this.BONUS_SET_GRAPHICS.depth = 3;

        this.WINLINE_GRAPHICS = this.add.graphics();

        this.processingTiles('items', 148, 148);
        this.processingTiles('rectangles', 168, 168);

        // init game map
        this.initGameState(this.GAME_OFFSET_X, this.TILE_WIDTH, this.GAME_OFFSET_Y, this.TILE_HEIGHT);

        const backgroud = this.add.image(0, 0, 'backgroud');
        backgroud.setOrigin(0, 0);
        backgroud.depth = 0;

        // black background game area
        const fillReact = this.add.rectangle(this.GAME_OFFSET_X - 10, this.GAME_OFFSET_Y - 10, 5 * this.TILE_WIDTH + 20, 3 * this.TILE_HEIGHT + 20, 0x111111);
        fillReact.setOrigin(0,0);
        fillReact.depth = 1;

        const slothback = this.add.image(this.CENTER_OFFSET_X, this.CENTER_OFFSET_Y, 'slotback');
        slothback.setOrigin(0, 0);
        slothback.depth = 3;

        const bottle = this.add.image(this.CENTER_OFFSET_X, this.CENTER_OFFSET_Y, 'bottle');
        bottle.setOrigin(0, 0);
        bottle.depth = 3;
        bottle.setPosition(1360, 460);

        const helmet = this.add.image(this.CENTER_OFFSET_X, this.CENTER_OFFSET_Y, 'helmet');
        helmet.setScale(0.5);
        helmet.setOrigin(0, 0);
        helmet.depth = 3;
        helmet.setRotation(-Math.PI/12);
        helmet.setPosition(-300, 500);
    }

    initGameState (offsetBorderX, ww, offsetBorderY, hh) {
        this.gameMap = [];
        for (let i = 0; i < this.GAME_TILES_YN; i++) {
            this.gameMap.push([]);
            for (let j = 0; j < this.GAME_TILES_XN; j++) 
            {
                this.gameMap[i][j] = new CellItem();
                this.gameMap[i][j].border = this.add.tileSprite(offsetBorderX + ww * (j + 0.5), offsetBorderY + hh * (i + 0.5), this.TILE_WIDTH, this.TILE_HEIGHT, 'rectangles', 0);
                this.gameMap[i][j].border.depth = 2;
                this.gameMap[i][j].sprite = this.add.tileSprite(offsetBorderX + ww * (j + 0.5), offsetBorderY + hh * (i + 0.5), this.SPRITE_TILE_WIDTH, this.SPRITE_TILE_HEIGHT, 'items', this.initLayer[i][j]);
                this.gameMap[i][j].spriteFrame = this.initLayer[i][j];
                this.applyEffects(this.gameMap[i][j])
                this.gameMap[i][j].sprite.depth = 3;
            }
        }
       
    }

    createDynamicTexture(frames) {
        const nameTexture = 'texture_' + this.uuidv4();
        const frameCount = frames.length;
        const dynamicTexture = this.textures.createCanvas(nameTexture, this.SPRITE_TILE_WIDTH, this.SPRITE_TILE_HEIGHT * frameCount);
        frames.map((frameIndex, i) => {
            dynamicTexture.drawFrame('items', frameIndex, 0, this.SPRITE_TILE_HEIGHT * i)
        });
        dynamicTexture.refresh();
        return nameTexture;
    }

    processingTiles (tileSetName, widthTile, heightTile) {
        const tiles = this.textures.get(tileSetName);
        const base = tiles.get();
        Phaser.Textures.Parsers.SpriteSheet(tiles, base.sourceIndex, base.x, base.y, base.width, base.height, {
            frameWidth: widthTile,
            frameHeight: heightTile
        });
    }

    createDynamicTexture_v2(newLayer) {
        const nameTexture = 'texture_' + this.uuidv4();
        const dynamicTexture = this.textures.createCanvas(nameTexture, this.SPRITE_TILE_WIDTH * this.GAME_TILES_XN, this.SPRITE_TILE_HEIGHT * this.GAME_TILES_YN * 2);
        newLayer.map((row, i) => 
            row.map((valueFrame, j) => 
                dynamicTexture.drawFrame('items', valueFrame, this.SPRITE_TILE_WIDTH * j, this.SPRITE_TILE_HEIGHT * i)
            )
        );

        this.gameMap.map((row, i) =>
            row.map((cell, j) => 
                dynamicTexture.drawFrame('items', cell.spriteFrame, this.SPRITE_TILE_WIDTH * j, this.SPRITE_TILE_HEIGHT * this.GAME_TILES_YN + this.SPRITE_TILE_HEIGHT * i)
            )
        );

        dynamicTexture.refresh();
        return nameTexture;
    }

    uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }
    
    setLayerItems (nextGameState)
    {
        this.stopAnimations();
        this.IS_NEXT_GEN_COMPLETED = false;
        const newTexture = this.createDynamicTexture_v2(nextGameState.gameMap);
        for (let i = 0; i < nextGameState.gameMap.length; i++) {
            for (let j = 0; j < nextGameState.gameMap[i].length; j++) {
                this.removeAllEffectsAndTweens(this.gameMap[i][j]);
                this.gameMap[i][j].sprite.setTexture(newTexture);
                this.gameMap[i][j].sprite.setTilePosition(this.SPRITE_TILE_WIDTH * j, this.SPRITE_TILE_HEIGHT * this.GAME_TILES_YN + this.SPRITE_TILE_HEIGHT * i);

                switch (nextGameState.status) {
                    case GameStatus.Normal:
                        this.normallyScript(i, j, nextGameState);
                    break;
                    case GameStatus.Winline: 
                        this.winlinesScript(i, j, nextGameState);
                    break;
                    case GameStatus.BonusSet:
                        this.bonusSetScript(i, j, nextGameState);
                    break;
                    case GameStatus.BonusGameMode:
                        this.bonusGameScript(i, j, nextGameState);
                    break;
                }
            }
        }
    }

    normallyScript(i, j, nextGameState) {
        this.gameMap[i][j].animation = this.add.tween({
            targets: this.gameMap[i][j].sprite,
            update: () => {
                this.gameMap[i][j].sprite.tilePositionY -= this.ANIMATION_ROLL_STEP_Y;
            },
            onComplete: () => {
                this.gameMap[i][j].spriteFrame = nextGameState.gameMap[i][j];
                this.gameMap[i][j].sprite.setTexture('items', nextGameState.gameMap[i][j]);
                this.gameMap[i][j].sprite.setTilePosition(0, 0);
                this.applyEffects(this.gameMap[i][j]);
                this.IS_NEXT_GEN_COMPLETED = (i + 1 == this.GAME_TILES_YN && j + 1 == this.GAME_TILES_XN);    
            },
            delay: this.IS_FAST_MODE ? null : j * 200,
            duration: 1,
            repeat: this.ROLL_SPIN_COUNT * this.ANIMATION_ROLL_STEP_COUNT * 3  - 1,
        });
    }

    winlinesScript(i, j, nextGameState) {
        this.gameMap[i][j].animation = this.add.tween({
            targets: this.gameMap[i][j].sprite,
            update: () => {
                this.gameMap[i][j].sprite.tilePositionY -= this.ANIMATION_ROLL_STEP_Y;
            },
            onComplete: () => {
                this.gameMap[i][j].spriteFrame = nextGameState.gameMap[i][j];
                this.gameMap[i][j].sprite.setTexture('items', nextGameState.gameMap[i][j]);
                this.gameMap[i][j].sprite.setTilePosition(0, 0);
        
                if (nextGameState.winLines[0][j] != i)
                    this.gameMap[i][j].sprite.setAlpha(0.2); 
                //     this.applyEffects(this.gameMap[i][j]);
                // else 
                    

                this.IS_NEXT_GEN_COMPLETED = i + 1 == this.GAME_TILES_YN && j + 1 == this.GAME_TILES_XN;
                if (this.IS_NEXT_GEN_COMPLETED) 
                    this.doAnimationWinline(nextGameState.winLines)    
            },
            delay: this.IS_FAST_MODE ? null : j * 200,
            duration: 1,
            repeat: this.ROLL_SPIN_COUNT * this.ANIMATION_ROLL_STEP_COUNT * 3  - 1,
        });
    }

    bonusSetScript(i, j, nextGameState) {
        const isBonusColumn = j >= nextGameState.bonusColumn;
        const bonusRolls = isBonusColumn ? 14  : 0;
        this.gameMap[i][j].animation = this.add.tween({
            targets: this.gameMap[i][j].sprite,
            update: () => {
                this.gameMap[i][j].sprite.tilePositionY -= this.ANIMATION_ROLL_STEP_Y;
            },
            onComplete: () => {
                this.gameMap[i][j].spriteFrame = nextGameState.gameMap[i][j];
                this.gameMap[i][j].sprite.setTexture('items', nextGameState.gameMap[i][j]);
                this.gameMap[i][j].sprite.setTilePosition(0, 0);
                this.applyEffects(this.gameMap[i][j]);
                this.IS_NEXT_GEN_COMPLETED = (i + 1 == this.GAME_TILES_YN && j + 1 == this.GAME_TILES_XN);    
                if (this.IS_NEXT_GEN_COMPLETED) {
                    this.BONUS_SET_GRAPHICS.postFX.clear();
                    this.BONUS_SET_GRAPHICS.clear();
                    this.tweens.killTweensOf(this.cameras.main);
                    this.cameras.main.zoom = 1;
                }
            },
            onStart: () => {
                if (i + 1 == this.GAME_TILES_YN && j + 1 == this.GAME_TILES_XN) {
                    this.BONUS_SET_GRAPHICS = this.add.graphics();
                    this.BONUS_SET_GRAPHICS.depth = 2;
                    this.BONUS_SET_GRAPHICS.lineStyle(1, 0xff0000);
                    this.BONUS_SET_GRAPHICS.strokeRect(this.GAME_OFFSET_X + nextGameState.bonusColumn * this.TILE_WIDTH + 6, this.GAME_OFFSET_Y-20,  
                        (this.GAME_TILES_XN - nextGameState.bonusColumn) * this.TILE_WIDTH - 9, this.GAME_TILES_YN * this.TILE_HEIGHT+40);
                    this.BONUS_SET_GRAPHICS.postFX.addGlow(0xff0000, 11, 0, false, 0.1, 24);

                    this.add.tween({
                        targets: this.cameras.main,
                        zoom: 1.1,
                        duration: 1300,
                        yoyo: true
                    });
                }
            },
            delay: this.IS_FAST_MODE ? null : j * 200,
            duration: 1,
            repeat: (bonusRolls + this.ROLL_SPIN_COUNT) * this.ANIMATION_ROLL_STEP_COUNT * 3  - 1,
        });
    }

    bonusGameScript(i, j, nextGameState) {
        if (this.gameMap[i][j].spriteFrame == ItemsId.Cap) {
            this.gameMap[i][j].spriteFrame = ItemsId.Cap;
            this.gameMap[i][j].sprite.setTexture('items', ItemsId.Cap);
            this.gameMap[i][j].sprite.setTilePosition(0, 0);
            this.applyEffects(this.gameMap[i][j]);
        }

        this.gameMap[i][j].animation = this.add.tween({
            targets: this.gameMap[i][j].sprite,
            update: () => {
                if (this.gameMap[i][j].spriteFrame != ItemsId.Cap)
                    this.gameMap[i][j].sprite.tilePositionY -= this.ANIMATION_ROLL_STEP_Y;
            },
            onComplete: () => {
                if (this.gameMap[i][j].spriteFrame != ItemsId.Cap) 
                {
                    this.gameMap[i][j].spriteFrame = nextGameState.gameMap[i][j];
                    this.gameMap[i][j].sprite.setTexture('items', nextGameState.gameMap[i][j]);
                    this.gameMap[i][j].sprite.setTilePosition(0, 0);
                    this.applyEffects(this.gameMap[i][j]);
                }
                this.IS_NEXT_GEN_COMPLETED = (i + 1 == this.GAME_TILES_YN && j + 1 == this.GAME_TILES_XN);    
            },
            delay: this.IS_FAST_MODE ? null : j * 200,
            duration: 1,
            repeat: this.ROLL_SPIN_COUNT * this.ANIMATION_ROLL_STEP_COUNT * 3  - 1,
        });
    }

    stopAnimations () {
        clearInterval(this.WINLINE_ANIMATION_TIMER);
        this.WINLINE_ANIMATION_TIMER = null
        this.WINLINE_GRAPHICS.postFX.clear();
        this.WINLINE_GRAPHICS.clear();

        this.BONUS_SET_GRAPHICS.postFX.clear();
        this.BONUS_SET_GRAPHICS.clear();

        for (let i = 0; i < this.GAME_TILES_YN; i++) {
            for (let j = 0; j < this.GAME_TILES_XN; j++) {
                this.gameMap[i][j].sprite.setAlpha(1);
            }
        }
    }

    doAnimationWinline(winLines) {
        const lineLimit = winLines.length;
        let currLine = 0;
        
        this.winLineTimerTickEvent(winLines[0]);

        this.WINLINE_ANIMATION_TIMER = setInterval(() => {
            this.disableUnwinableCell(winLines[currLine]);

            currLine = (currLine + 1) % lineLimit; 
            this.winLineTimerTickEvent(winLines[currLine]);
        }, 2000);
    }

    disableUnwinableCell(winline) {
        winline.map((i, j) => {
            this.removeAllEffectsAndTweens(this.gameMap[i][j]);
            this.gameMap[i][j].sprite.setAlpha(0.2);
        });
    }

    winLineTimerTickEvent(winline) {
        if (this.WINLINE_GRAPHICS.postFX) this.WINLINE_GRAPHICS.postFX.clear();
        this.WINLINE_GRAPHICS.clear();

        let winlineVectors = winline.map((i, j) => {
            this.applyEffects(this.gameMap[i][j]);
            this.gameMap[i][j].sprite.setAlpha(1);
            return new Phaser.Math.Vector2(this.gameMap[i][j].sprite.x, this.gameMap[i][j].sprite.y);
        });
        // let first = winline[0];
        // let last = winline[this.GAME_TILES_XN - 1];
        // winlineVectors.splice(0, 0, new Phaser.Math.Vector2(0, this.gameMap[first][0].sprite.y));
        // winlineVectors.push(new Phaser.Math.Vector2(this.GAME_OFFSET_X + this.GAME_TILES_XN * this.TILE_WIDTH, this.gameMap[last][4].sprite.y));

        this.WINLINE_GRAPHICS = this.add.graphics();
        this.WINLINE_GRAPHICS.lineStyle(12, 0x00ff00);
        this.WINLINE_GRAPHICS.fillStyle(0xff0000, 1);
        this.WINLINE_GRAPHICS.strokePoints(winlineVectors, false);
        this.WINLINE_GRAPHICS.setAlpha(0.9);
        this.WINLINE_GRAPHICS.postFX.addGlow(0x00ffff, 1, 0, false, 0.1, 24);
        this.WINLINE_GRAPHICS.depth = 2;
    }

    removeAllEffectsAndTweens(cellItem) {
        cellItem.sprite.setScale(1);
        cellItem.border.setTexture('rectangles', 0);
        this.tweens.killTweensOf(cellItem.sprite);
        if (cellItem.fx) 
        {
            cellItem.sprite.postFX.clear();
            cellItem.sprite.preFX.clear();
            cellItem.fx = null;
        }
    }

    applyEffects(cellItem) {
        switch(cellItem.spriteFrame) 
        {
            case ItemsId.Coin: 
                cellItem.fx = cellItem.sprite.preFX.addGlow(0xFFD700);
                this.tweens.add({
                    targets: cellItem.fx,
                    outerStrength: 9,
                    yoyo: true,
                    loop: -1,
                    ease: 'sine.inout'
                });
            break;

            case ItemsId.Dosimeter: 
                cellItem.fx = cellItem.sprite.postFX.addPixelate(40);
                this.add.tween({
                    targets: cellItem.fx,
                    duration: 700,
                    amount: -1,
                    ease: 'sine.inout'
                });
            break;

            case ItemsId.Bonus:
                //cellItem.border.setTexture('rectangles', 2);
                cellItem.fx = cellItem.sprite.postFX.addShine(1, 0.2, 5);
                this.add.tween({
                    targets: cellItem.sprite,
                    scale: 1.1,
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                });
            break;

            case ItemsId.Cap:
                cellItem.border.setTexture('rectangles', 3);
                // this.add.tween({
                //     targets: cellItem.sprite,
                //     scale: 1.2,
                //     duration: 800,
                //     yoyo: true,
                //     repeat: -1
                // });
            break;
        }
    }
}

