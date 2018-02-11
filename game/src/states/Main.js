import Aircraft from '../objects/AircraftObject';
import {State, Group, Physics, Point, Text, Game, Line, Signal} from 'phaser'
import config from '../config'
import Chains from '../objects/ChainsObject'
import EnemyAI from '../ai/EnemyAI'

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
		game.load.atlas('weapon', 'assets/weapon.png', 'assets/weapon.json')
		game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json')

		// const chainGraphics = game.add.graphics(0, 0)
		// chainGraphics.lineStyle(2, 0xAAAAAA, 1) // lineWidth, color, alpha
		// chainGraphics.lineTo(10, 0)
		// chainGraphics.lineTo(10, 10)
		// chainGraphics.lineTo(0, 10)
		// chainGraphics.lineTo(0, 0)

		// this.graphics = {
		// 	chainGraphics: chainGraphics
		// }
	}

	create() {
		const {game} = this
		game.physics.startSystem(Physics.P2JS) // 使用p2js物理引擎
		game.physics.p2.restitution = config.restitution
		game.physics.p2.gravity.y = config.gravity.y

		const userAircraft = new Aircraft(game, {}, "sprite", game.width/3*2, game.height/2, "breakout", "brick_1_1.png")
		console.log("userAircraft", userAircraft)

		const ballGroup = game.add.physicsGroup(Physics.P2JS)

		const ball = ballGroup.create(game.width / 2, 0, 'weapon', 'stone.png')
		ball.width = 32
		ball.height = 32
		ball.body.parent = userAircraft.aircraft.body
		ball.body.setCircle(32)
		ball.body.mass = 1
		ball.body.damping = 0.9
		window.ball = ball

		const chains = new Chains(game, {}, ball.body, userAircraft.aircraft.body, game.width/2, game.height/2, 
			'weapon', 'chain.png')

		const enemyAircraft = new Aircraft(game, {}, "sprite", game.width/3, game.height/2, "breakout", "brick_2_1.png")

		const enemyBall = ballGroup.create(game.width/3, 0, 'weapon', 'stone.png')
		enemyBall.width = 32
		enemyBall.height = 32
		enemyBall.body.parent = enemyAircraft.aircraft.body
		enemyBall.body.setCircle(32)
		enemyBall.body.mass = 1
		enemyBall.body.damping = 0.9
		window.enemy = enemyAircraft

		const enemyChains = new Chains(game, {}, enemyBall.body, enemyAircraft.aircraft.body, game.width/3, game.height/2, 
			'weapon', 'chain.png')
	

		const enemyAI = new EnemyAI(enemyAircraft, userAircraft)

		const signal = new Signal()

		userAircraft.aircraft.body.onBeginContact = signal
		signal.add((target) => {
			const self = userAircraft.aircraft.body
			if (target == enemyBall.body) {
				const speed = Math.pow(Math.pow(target.velocity.x - self.velocity.x, 2) + 
					Math.pow(target.velocity.y - self.velocity.y, 2), 0.5)
				userAircraft.damage(speed * 0.01)
			}
			if (target == enemyAircraft.aircraft.body) {
				const speed = Math.pow(Math.pow(target.velocity.x - self.velocity.x, 2) + 
					Math.pow(target.velocity.y - self.velocity.y, 2), 0.5)
				userAircraft.damage(speed * 0.001)
			}
		})
		const enemySignal = new Signal()

		enemyAircraft.aircraft.body.onBeginContact = enemySignal
		enemySignal.add((target) => {
			const self = userAircraft.aircraft.body
			if (target == ball.body) {
				const speed = Math.pow(Math.pow(target.velocity.x - self.velocity.x, 2) + 
					Math.pow(target.velocity.y - self.velocity.y, 2), 0.5)
				enemyAircraft.damage(speed * 0.01)
			}
			if (target == userAircraft.aircraft.body) {
				const speed = Math.pow(Math.pow(target.velocity.x - self.velocity.x, 2) + 
					Math.pow(target.velocity.y - self.velocity.y, 2), 0.5)
				enemyAircraft.damage(speed * 0.001)
			}
		})
		
		
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
			enemyAI.update()
			enemyAircraft.update()
			userAircraft.update()
		}

		this._render = () => {
			const objectNumber = getObjectNumber(game.add.world)
			game.debug.text("Your hp [" + parseInt(userAircraft.hp) + "/ 100 ],    Enemy hp [" + parseInt(enemyAircraft.hp) + "/ 100 ]" , 32, 32)
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
