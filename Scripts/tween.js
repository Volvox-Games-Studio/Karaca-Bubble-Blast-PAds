import * as pc from 'playcanvas';
import { waitNextFrame } from './async';


export async function move(entity, endPos, duration, ease) {
    var currentTime = performance.now() / 1000;
    var t = 0.0;
    var flag = true;
    var startPos = entity.getPosition();

    while (flag)
    {
        var speed = 1.0 / duration;
        var time = performance.now() / 1000;
        var dt = time - currentTime;
        currentTime = time;

        t += dt * speed;

        if (t > 1.0)
        {
            t = 1.0;
            flag = false;
        }

        const newPos = new pc.Vec3();
        newPos.lerp(startPos, endPos, ease(t));
        entity.setPosition (newPos);

        await waitNextFrame();
    }
}