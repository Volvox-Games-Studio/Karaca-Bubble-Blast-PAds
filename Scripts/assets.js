import * as pc from 'playcanvas';
import * as sprites from './sprites'
import * as settings from './settings'


export const fruitSprites = [];


export var backgroundSprite;
export var gridBackgroundSprite;
export var fruitGunSprite;


export function loadBackgroundSprites(app, callback)
{
    sprites.loadTexture(app, 'backgrounds.png', (texture) => {
        var backgroundScale = 1.6 * settings.ORTHO_SIZE / settings.HEIGHT;
        var gridScale = 1.3 * settings.ORTHO_SIZE / settings.HEIGHT;

        backgroundSprite = sprites.create(texture, 2046 * backgroundScale, 3634 * backgroundScale, new pc.Vec4(0, 0, 0.4995, 0.8872), sprites.ANCHOR_CENTER(), sprites.PIVOT_CENTER());
        gridBackgroundSprite = sprites.create(texture, 1941 * gridScale * 1.02, 2724 * gridScale * 1.18, new pc.Vec4(0.5, 0.0, 0.47388, 0.66504), sprites.ANCHOR_CENTER(), sprites.PIVOT_CENTER());

        callback();
    })
}

export function loadFruitGunSprite(app, callback)
{
    sprites.loadTexture(app, 'fruit_gun.png', (texture) => {
        fruitGunSprite = sprites.create(texture, 3, 3, new pc.Vec4(0, 0, 1, 1), sprites.ANCHOR_CENTER(), sprites.PIVOT_CENTER());
        fruitGunSprite.element.drawOrder = 100;

        callback();
    });
}

export function loadFruitSprites(app, callback)
{
    sprites.loadTexture(app, 'fruits.png', (texture) => {
        const width = 1;
        const height = 1;
        const uvz = 1 / 3;
        const uvw = 1 / 2;
        const anchor = sprites.ANCHOR_CENTER();
        const pivot = sprites.PIVOT_CENTER();
    
        const testUv0 = new pc.Vec4(uvz * 0, uvw * 0, uvz, uvw);
        const sprite0 = sprites.create(texture, width, height, testUv0, anchor, pivot);
    
        const testUv1 = new pc.Vec4(uvz * 1, uvw * 0, uvz, uvw);
        const sprite1 = sprites.create(texture, width, height, testUv1, anchor, pivot);
    
        const testUv2 = new pc.Vec4(uvz * 2, uvw * 0, uvz, uvw);
        const sprite2 = sprites.create(texture, width, height, testUv2, anchor, pivot);
    
        const testUv3 = new pc.Vec4(uvz * 3, uvw * 1, uvz, uvw);
        const sprite3 = sprites.create(texture, width, height, testUv3, anchor, pivot);
    
        const testUv4 = new pc.Vec4(uvz * 4, uvw * 1, uvz, uvw);
        const sprite4 = sprites.create(texture, width, height, testUv4, anchor, pivot);
    
        const testUv5 = new pc.Vec4(uvz * 5, uvw * 1, uvz, uvw);
        const sprite5 = sprites.create(texture, width, height, testUv5, anchor, pivot);
    
        fruitSprites.push(sprite0);
        fruitSprites.push(sprite1);
        fruitSprites.push(sprite2);
        fruitSprites.push(sprite3);
        fruitSprites.push(sprite4);
        fruitSprites.push(sprite5);

        callback();
    });
}