import * as pc from 'playcanvas';


export function ANCHOR_CENTER() {return new pc.Vec4(0.5, 0.5, 0.5, 0.5)}
export function ANCHOR_TOP() {return new pc.Vec4(0.5, 1, 0.5, 1)}
export function ANCHOR_BOTTOM() {return new pc.Vec4(0.5, 0, 0.5, 0)}


export function PIVOT_CENTER() {return new pc.Vec2(0.5, 0.5)}
export function PIVOT_TOP() {return new pc.Vec2(0.5, 1)}
export function PIVOT_BOTTOM() {return new pc.Vec2(0.5, 0)}


export function create(textureAsset, width, height, uv, anchor, pivot) {
    // Create a sprite entity
    const entity = new pc.Entity();
    entity.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: anchor,
        pivot: pivot,
        width: width,
        height: height,
        useInput: true
    });

    // Set the texture
    entity.element.texture = textureAsset.resource;
    entity.element.rect = uv;

    return entity;
}

export function loadTexture(app, textureUrl, callback) {
    app.assets.loadFromUrl('Assets/' + textureUrl, 'texture', (err, texture) => {
        if (!err) {
            callback(texture);
        } else {
            console.error(err);
            callback(null);
        }
    });
}