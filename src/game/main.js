import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    transparent: true,
    debug: true,
    scene: [
        Boot,
        Preloader,
        Game
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
