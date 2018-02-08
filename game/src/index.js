import Boot from 'states/Boot';
import Preload from 'states/Preload';
import GameTitle from 'states/GameTitle';
import Main from 'states/Main';
import GameOver from 'states/GameOver';
import Phaser from 'phaser'

class Game extends Phaser.Game {

	constructor() {

		super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

		this.state.add('Boot', Boot, false);
		this.state.add('Preload', Preload, false);
		this.state.add('GameTitle', GameTitle, false);
		this.state.add('Main', Main, false);
		this.state.add('GameOver', GameOver, false);

		this.state.start('Boot');
	}

}

const game = new Game()

window.onload = () => {
	// lock pointer
	const canvas = document.getElementsByTagName("canvas")[0]
	canvas.addEventListener('click', () => {
		canvas.requestPointerLock()
	})

    document.addEventListener('pointerlockchange', function () {
        if (document.pointerLockElement == canvas) {
            document.addEventListener("mousemove", handleMouseMove, false);
        } else {
            document.removeEventListener("mousemove", handleMouseMove, false);
        }
    }, false);
	
	const handleMouseMove = (event) => {
		if (!!game.mouseMove) game.mouseMove(event.movementX, event.movementY)
	}
}