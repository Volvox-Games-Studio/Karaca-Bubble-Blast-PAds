import * as settings from './settings'


export const EVENTS = new EventTarget();


export var TOUCH_X = 0;
export var TOUCH_Y = 0;


export function onTouchStart(camera, event)
{
    onTouchMove(camera, event);
}

export function onTouchMove(camera, event)
{
    var cameraPos = camera.getPosition();

    TOUCH_X = 2 * settings.ORTHO_SIZE * settings.ASPECT_RATIO * ((event.touches[0].x / settings.WIDTH) - 0.5) + cameraPos.x;
    TOUCH_Y = 2 * settings.ORTHO_SIZE * (((settings.HEIGHT - event.touches[0].y) / settings.HEIGHT) - 0.5) + cameraPos.y;
}

export function onTouchEnd(event)
{
    EVENTS.dispatchEvent(new CustomEvent('touchEnd'));
}