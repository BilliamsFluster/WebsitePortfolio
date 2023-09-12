import { GameEntity, StateMachine} from "yuka";
import { IdleState, WalkState, RunState } from "./foxStates.js";

class Fox extends GameEntity
{
    constructor(mixer, animations)
    {
        super();
        this.mixer = mixer;
        this.animations = animations;
        this.stateMachine = new StateMachine(this);
        this.stateMachine.add('IDLE', new IdleState());
        this.stateMachine.add('WALK', new WalkState());
        this.stateMachine.add('RUN', new RunState());

        this.stateMachine.changeTo('IDLE');
        this.isRunning = false;
        this.isIdle = true;
        this.isWalking = false;

        this.crossFadeDuration = 1.2;
    }
    update(delta)
    {
        this.mixer.update(delta);
        this.stateMachine.update();
        return this;
    }
}
export {Fox};