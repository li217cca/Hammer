import {Physics, Line} from 'phaser'

class AircraftObject {

	constructor(game) {
		this.game = game

		const aircraft = game.add.sprite(game.width/2, game.height/2, "breakout", "brick_1_1.png")
		this.aircraft = aircraft
		aircraft.height = 50
		aircraft.width = 40
		game.physics.p2.enable(aircraft)
		aircraft.body.setRectangleFromSprite()
		aircraft.body.mass = 100
		aircraft.body.damping = 0.96


		const hammer = game.add.sprite(game.width/2, game.height/2 + 10, "breakout", "ball_4.png")
		this.hammer = hammer
		game.physics.p2.enable(hammer)
		hammer.body.mass = 50
		hammer.body.damping = 0.96
		
		const constraint = game.physics.p2.createDistanceConstraint(aircraft, hammer, 100)
		this.constraint = constraint

		const speedLine = new Line(aircraft.x, aircraft.y, aircraft.x, aircraft.y)
		this.speedLine = speedLine

		const line = new Line(aircraft.x, aircraft.y, hammer.x, hammer.y)
		this.line = line
		
		this.prevForce = {x: 0, y: 0}
	}

	update() {
		const x = this.prevForce.x * 0.8
		const y = this.prevForce.y * 0.8
		this.aircraft.body.applyForce([-x * 50, -y * 50], 0, 0)
		this.prevForce = {x, y}

		
			this.aircraft.body.velocity.x *= 0.95
			this.aircraft.body.velocity.y *= 0.95

		// this.speedLine.setTo(
		// 	this.aircraft.x,
		// 	this.aircraft.y,
		// 	this.aircraft.x + this.aircraft.body.velocity.x,
		// 	this.aircraft.y + this.aircraft.body.velocity.y
		// )
		// this.line.fromSprite(
		// 	this.aircraft,
		// 	this.hammer,
		// 	false
		// )
		// const maxSpeed = 50
		// const x = this.aircraft.body.velocity.x, y = this.aircraft.body.velocity.y
		// const speed = Math.pow(x*x + y*y, 0.5)
		// if (speed > maxSpeed) {
		// 	// const dec = Math.pow(speedSqr, 0.5) - Math.pow(maxSpeedSqr, 0.5)
		// 	this.aircraft.body.velocity.x = x - x * (speed - maxSpeed) / speed * 0.7
		// 	this.aircraft.body.velocity.y = y - y * (speed - maxSpeed) / speed * 0.7
		// }
	}
	render() {
		this.game.debug.geom(this.speedLine);
		this.game.debug.geom(this.line);
		this.game.debug.spriteBounds(this.aircraft)
		this.game.debug.spriteBounds(this.hammer)
		this.game.debug.spriteInfo(this.aircraft)
	}

	mouseForce(x, y) {
		x = (x + this.prevForce.x) / 2
		y = (y + this.prevForce.y) / 2
		console.log("mouse force", parseInt(x), parseInt(y))
		this.aircraft.body.applyForce([-x * 400, -y * 400], 0, 0)
		this.prevForce = {x, y}
	}
}

export default AircraftObject;