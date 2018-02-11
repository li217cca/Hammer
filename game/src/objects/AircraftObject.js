import {Physics, Line} from 'phaser'

class Aircraft {

	constructor(game, {
			height = 50, 
			width = 40, 
			mass = 100, 
			damping = 0.9,
			forceLimit = 20
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

		this.alive = true

		this.hp = 100

		game.world.add(this.aircraft)
	}

	isAlive() {
		return this.alive
	}

	kill() {
		this.hp = 0
		this.alive = false
	}
	
	destroy(destroyChildren = true, destroyTexture = false) {
		this.aircraft.destroy(destroyChildren, destroyTexture)
	}

	speed() {
		const s = Math.pow(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y, 0.5)
		return s
	}

	damage(value) {
		this.hp -= value
		if (this.hp < 0) this.kill()
	}

	update() {
		this.x = this.aircraft.x
		this.y = this.aircraft.y
		this.velocity = this.aircraft.body.velocity
		// const x = this.aircraft.body.force.x * 0.2
		// const y = this.aircraft.body.force.y * 0.2
		// this.aircraft.body.applyForce([-x, -y], 0, 0)
	}
	render() {
		// this.game.debug.body(this.aircraft)
		// this.game.debug.spriteInfo(this.aircraft)
	}

	move(point) {
		if (!this.alive) return;

		const force = Math.pow(point.x*point.x + point.y*point.y, 0.5)
		if (force > this.forceLimit) {
			point.x *= this.forceLimit / force
			point.y *= this.forceLimit / force
		}

		this.aircraft.body.applyImpulse([-point.x * 20, -point.y * 20], 0, 0)
	}
}

export default Aircraft;