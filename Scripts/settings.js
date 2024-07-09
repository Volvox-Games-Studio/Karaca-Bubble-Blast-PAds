export const ORTHO_SIZE = 10;


export var WIDTH;
export var HEIGHT;
export var ASPECT_RATIO;


export function setSize(width, heigth)
{
    WIDTH = width;
    HEIGHT = heigth;
    ASPECT_RATIO = WIDTH / HEIGHT;
}