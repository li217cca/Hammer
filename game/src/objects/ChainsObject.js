import {} from 'phaser'
import {Physics, Line} from 'phaser'

class Aircraft {

	constructor(game, {
			height = 15, 
            width = 6,
            mass = 0.01,
            number = 5
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
                1e10
            )

            prevBody = chain.body
        }
        const constraint = game.physics.p2.createRevoluteConstraint(prevBody, 
            [width/2, 0],
            body2, 
            [0, 0],
            1e10
        )

        // const finalConstraint  = game.physics.p2.createDistanceConstraint(body1, 
        //     body2,
        //     height*number + 10,
        //     [width/2, 0],
        //     [0, 0],
        // )

        // window.cc = finalConstraint
        // finalConstraint.lowerLimitEnabled = true
        // console.log("finalConstraint", finalConstraint)
	}

	destroy(destroyChildren = true, destroyTexture = false) {
		// this.aircraft.destroy(destroyChildren, destroyTexture)
    }
}

export default Aircraft;