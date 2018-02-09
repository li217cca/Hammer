import Aircraft from '../objects/AircraftObject';
import {State, Group, Physics, Point, Text, Game, Line} from 'phaser'
import config from '../config'
import Chains from '../objects/ChainsObject'

window.Game = Game
		
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

		game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json')


		const chainGraphics = game.add.graphics(0, 0)
		chainGraphics.lineStyle(2, 0xAAAAAA, 1) // lineWidth, color, alpha
		chainGraphics.lineTo(10, 0)
		chainGraphics.lineTo(10, 10)
		chainGraphics.lineTo(0, 10)
		chainGraphics.lineTo(0, 0)

		this.graphics = {
			chainGraphics: chainGraphics
		}
	}

	create() {
		const {game} = this
		game.physics.startSystem(Physics.P2JS) // 使用p2js物理引擎
		game.physics.p2.restitution = config.restitution
		game.physics.p2.gravity.y = config.gravity.y


		const userAircraft = new Aircraft(game, {}, "sprite", game.width/2, game.height/2, "breakout", "brick_1_1.png")
		console.log("userAircraft", userAircraft)

		const ballGroup = game.add.physicsGroup(Physics.P2JS)

		const ball = ballGroup.create(game.width / 2, 0, 'breakout', 'ball_1.png')
		ball.body.mass = 1
		window.ball = ball


		const chains = new Chains(game, {}, ball.body, userAircraft.aircraft.body, game.width/2, game.height/2, this.graphics.chainGraphics.generateTexture())
		
		// const chain = game.add.sprite(game.width/2, game.height/2, this.graphics.chainGraphics.generateTexture())
		// const ball = game.add.sprite(game.width/2, game.height/2, "breakout", "ball_1.png")

		// const point = ballGroup.create(game.width / 2, 0, 'breakout', 'ball_1.png')
		// point.body.static = true
		// const item = ballGroup.create(game.width / 2, 0, 'breakout', 'ball_1.png')
		// item.body.mass = 100
		// window.constraint = game.physics.p2.createDistanceConstraint(point, item, 100)

		// const line = new Line()


		game.mouseMove = (x, y) => {
			userAircraft.move(new Point(x, y))
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
			// line.fromSprite(point, item)
			userAircraft.update()
		}

		this._render = () => {
			const objectNumber = getObjectNumber(game.add.world)
			game.debug.text("Object number: " + objectNumber, 32, 128)
			// if (!!line) game.debug.geom(line)

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
