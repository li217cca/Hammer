import {} from 'phaser'
import {Physics, Line} from 'phaser'

class Aircraft {

	constructor(game, {
			height = 12, 
            width = 6,
            mass = 0.05,
            number = 6
		}, body1, body2, ...props) {
		
        this.game = game
        
        this.chainGroup = game.add.physicsGroup(Physics.P2JS)

        let prevBody = body1
        for (let i = 0; i < number; i++) {
            const chain = this.chainGroup.create(...props)
            chain.height = height
            chain.width = width
            chain.mass = mass
            // chain.body.clearShapes()
            chain.body.setCircle(10)
            chain.body.data.shapes[0].sensor = true

            const constraint = game.physics.p2.createRevoluteConstraint(prevBody, 
                [width/2, 0],
                chain.body, 
                [width/2, height],
                1e200
            )
            constraint.setStiffness(1e200)

            prevBody = chain.body
        }
        const constraint = game.physics.p2.createRevoluteConstraint(prevBody, 
            [width/2, 0],
            body2, 
            [width/2, height],
            1e200
        )
        constraint.setStiffness(1e200)
        
        console.log("constraint", constraint)
	}

	destroy(destroyChildren = true, destroyTexture = false) {
		// this.aircraft.destroy(destroyChildren, destroyTexture)
    }
}

export default Aircraft;