import {Point} from 'phaser'
class BaseState {
    constructor(parent) {
        this.state = "wait"
        this.aircraft = parent.aircraft
        console.log("aiccc", this.aircraft)
        this.preUpdate = new Date()
    }
    wait() {
        this.state = "wait"
    }

    turnAround() {
        this.state = "turn"
    }

    moveTo(target) {
        this.state = "move"
        this.target = target
    }
    turnMove(target) {
        this.state = "turnMove"
        this.target = target
    }

    update() {
        if (new Date() - this.preUpdate < 20) return;
        switch (this.state) {
            case "wait": {
                break
            }
            case "turn": {
                this.aircraft.move(new Point(
                    this.aircraft.velocity.y * 0.3,
                    -this.aircraft.velocity.x * 0.3
                ))
                break
            }
            case "turnMove": {
                // if (Math.pow(this.aircraft.velocity.x, 2) + Math.pow(this.aircraft.velocity.y, 2) > 10000) {
                //     this.aircraft.move(new Point(
                //         this.aircraft.velocity.y * 3,
                //         -this.aircraft.velocity.x * 3
                //     ))
                // }

                this.aircraft.move(new Point(
                    this.target.x - this.aircraft.x + this.aircraft.velocity.y * 0.2,
                    this.target.y - this.aircraft.y - this.aircraft.velocity.x * 0.2
                ))
                break
            }
            case "move": {
                this.aircraft.move(new Point(
                    this.target.x - this.aircraft.x,
                    this.target.y - this.aircraft.y
                ))
                break
            }
        }
        this.preUpdate = new Date()
    }
}

class ActionState {
    constructor(parent) {
        this.state = "wait"
        this.enemy = parent.enemy
        this.aircraft = parent.aircraft
        this.baseState = new BaseState(this)
        this.preUpdate = new Date()
    }
    hunting() {
        this.state = "hunt"
        this.baseState.wait()
    }
    battle(target) {
        this.state = "battle"
        this.target = target
        console.log("battle target", target)
    }
    distance(target) {
        return Math.pow(Math.pow(this.aircraft.x - target.x, 2) + Math.pow(this.aircraft.y - target.y, 2), 0.5)
    }
    update() {
        if (new Date() - this.preUpdate > 300) {
            switch (this.state) {
                case "hunt": {
                    if (this.enemy.isAlive()) {
                        this.battle(this.enemy)
                    }
                    break
                }
                case "battle": {
                    if (!this.target.isAlive()) {
                        this.hunting()
                        break
                    }
                    const dis = this.distance(this.target)
    
                    if (dis < 300 && this.aircraft.speed() < 150) {
                        this.baseState.moveTo({
                            x: this.aircraft.x * 2 - this.target.x,
                            y: this.aircraft.y * 2 - this.target.y
                        })
                        break
                    }
                    if (dis < 70) {
                        this.baseState.turnAround()
                    } else if (dis < 200) {
                        this.baseState.turnMove(this.target)
                    } else {
                        this.baseState.moveTo(this.target)
                    }
                }
            }
            this.preUpdate = new Date()
        }
        
        this.baseState.update()
    }
}

class EnemyAI {
    constructor(thisAircraft, enemyAircraft) {
        this.aircraft = thisAircraft
        this.enemy = enemyAircraft
        this.actionState = new ActionState(this)
        this.actionState.hunting()
        console.log("ai", this)

        this.preUpdate = new Date()
    }

    update() {
        this.actionState.update()
    }
}

export default EnemyAI