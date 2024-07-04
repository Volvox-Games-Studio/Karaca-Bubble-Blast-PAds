import * as settings from './settings'


export var TOUCH_X = 0;
export var TOUCH_Y = 0;


export function onTouchMove(event)
{
    TOUCH_X = 2 * settings.ORTHO_SIZE * settings.ASPECT_RATIO * ((event.touches[0].x / settings.WIDTH) - 0.5);
    TOUCH_Y = 2 * settings.ORTHO_SIZE * (((settings.HEIGHT - event.touches[0].y) / settings.HEIGHT) - 0.5);
}