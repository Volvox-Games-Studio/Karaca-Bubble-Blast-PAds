import * as pc from 'playcanvas';
import * as sprites from './sprites'


export const fruitSprites = [];


export var fruitGunSprite;


export function loadFruitGunSprite(app, callback)
{
    sprites.loadTexture(app, 'fruit_gun.png', (texture) => {
        fruitGunSprite = sprites.create(texture, 1.5, 1.5, new pc.Vec4(0, 0, 1, 1), sprites.ANCHOR_CENTER(), sprites.PIVOT_CENTER());

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