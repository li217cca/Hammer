import AircraftObject from 'objects/AircraftObject';
import {State, Group, Physics, Point, Text} from 'phaser'

		
const getObjectNumber = (root) => {
	let res = 1
	for (let child of root.children) {
		res += getObjectNumber(child)
	}
	return res
}

class Main extends State {

	preload() {
		const {game} = this

		game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');
		// game.load.image('starfield', 'static/assets/starfield.jpg');
	}

	create() {
		const {game} = this
		
		game.physics.startSystem(Physics.P2JS) // 使用p2js物理引擎
		console.log("gameWorld", game.add.world)
		game.physics.p2.restitution = 0.3 // 碰撞物体之间恢复的默认系数
		game.physics.p2.applyDamping = 0.95
		game.physics.p2.gravity.y = 10

		const userAircraft = new AircraftObject(game)
		console.log("userAircraft", userAircraft)

		const ballGroup = game.add.physicsGroup(Physics.P2JS)

		// const ball = game.add.sprite(game.width/2, game.height/2, "breakout", "ball_1.png")

		game.mouseMove = (x, y) => {
			userAircraft.mouseForce(x, y)
		}
		// setInterval(() => {
		// 	for (let i = 0; i < 3; i++) {
		// 		const ball = ballGroup.create(game.width / 2, 0, 'breakout', 'ball_1.png')
		// 		setTimeout(() => {
		// 			ball.kill()
		// 			ball.parent.removeChild(ball)
		// 		}, 20000)
		// 	}
		// }, 500)

		this._update = () => {
			userAircraft.update()
		}
		this._render = () => {
			const objectNumber = getObjectNumber(game.add.world)
			game.debug.text("Object number: " + objectNumber, 32, 128);
			
			userAircraft.render()
		}
	}

	update() {
		this._update()
	}

	render() {
		this._render()
	}
}

export default Main;
