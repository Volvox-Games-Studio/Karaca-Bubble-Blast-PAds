export const ORTHO_SIZE = 10;


export var WIDTH;
export var HEIGHT;
export var ASPECT_RATIO;


export function setAspectRatio(aspectRatio)
{
    ASPECT_RATIO = aspectRatio;
    HEIGHT = 2796;
    WIDTH = Math.ceil(HEIGHT * aspectRatio);
}

export function setSize(width, height)
{
    WIDTH = width;
    HEIGHT = height;
}