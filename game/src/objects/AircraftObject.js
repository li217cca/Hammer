import {Physics, Line} from 'phaser'

class Aircraft {

	constructor(game, {
			height = 50, 
			width = 40, 
			mass = 100, 
			damping = 0.95,
			forceLimit = 100
		}, type, ...props) {
		
		this.game = game
		this.forceLimit = forceLimit

		this.aircraft = game.add[type](...props)
		this.aircraft.height = height
		this.aircraft.width = width

		game.physics.p2.enable(this.aircraft)
		this.aircraft.body.setRectangleFromSprite()
		this.aircraft.body.mass = mass
		this.aircraft.body.damping = damping

		game.world.add(this.aircraft)
	}
	
	destroy(destroyChildren = true, destroyTexture = false) {
		this.aircraft.destroy(destroyChildren, destroyTexture)
	}

	update() {
		console.log(this.aircraft.body.force.x, this.aircraft.body.force.y)
		const x = this.aircraft.body.force.x * 0.2
		const y = this.aircraft.body.force.y * 0.2
		this.aircraft.body.applyForce([-x, -y], 0, 0)
	}
	render() {
		this.game.debug.body(this.aircraft)
		this.game.debug.bodyInfo(this.aircraft)
	}

	move(point) {
		const force = Math.pow(point.x*point.x + point.y*point.y, 0.5)
		if (force > this.forceLimit) {
			point.x *= forceLimit / force
			point.y *= forceLimit / force
		}
		console.log("move", point.x, point.y,  Math.pow(point.x*point.x + point.y*point.y, 0.5))
		this.aircraft.body.applyForce([-point.x * 100, -point.y * 100], 0, 0)
	}
}

export default Aircraft;