import { State } from "yuka";

const IDLE = 'IDLE';
const WALK = 'WALK';
const RUN = 'RUN';


class IdleState extends State
{
    enter(fox)
    {
        const idle = fox.animations.get(IDLE);
        idle.reset().fadeIn(fox.crossFadeDuration);
    }
    execute(fox) 
    {
        if(fox.isRunning)
        {
            fox.stateMachine.changeTo(RUN);
        }
        if(fox.isWalking)
        {
            fox.stateMachine.changeTo(WALK);
        }
    }
    exit(fox) 
    {
        const idle = fox.animations.get(IDLE);
        idle.fadeOut(fox.crossFadeDuration);
    }
}
class WalkState extends State
{
    enter(fox)
    {
        const walk = fox.animations.get(WALK);
        walk.reset().fadeIn(fox.crossFadeDuration);
    }
    execute(fox) 
    {
        if(fox.isIdle)
        {
            fox.stateMachine.changeTo(IDLE);
        }
        if(fox.isRunning)
        {
            fox.stateMachine.changeTo(RUN);
        }
    }
    exit(fox) 
    {
        const walk = fox.animations.get(WALK);
        walk.fadeOut(fox.crossFadeDuration);
    }
}
class RunState extends State
{
    enter(fox)
    {
        const run = fox.animations.get(RUN);
        run.reset().fadeIn(fox.crossFadeDuration);
    }
    execute(fox) 
    {
        if(fox.isIdle)
        {
            fox.stateMachine.changeTo(IDLE);
        }
        if(fox.isWalking)
        {
            fox.stateMachine.changeTo(WALK);
        }
    }
    exit(fox) 
    {
        const run = fox.animations.get(RUN);
        run.fadeOut(fox.crossFadeDuration);
    }
}
export {IdleState, WalkState, RunState};