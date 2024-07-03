import * as pc from 'playcanvas';
import * as settings from './settings'

// create an application
const canvas = document.getElementById('application');
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});
app.setCanvasResolution(pc.RESOLUTION_FIXED, settings.WIDTH, settings.HEIGHT);
app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT);
app.start();

// create a camera
const camera = new pc.Entity();
camera.addComponent('camera', {
    clearColor: new pc.Color(0.3, 0.3, 0.7),
    projection: pc.PROJECTION_ORTHOGRAPHIC,
    orthoHeight: 5,
    nearClip: 0.1,
    farClip: 1000
});
camera.setPosition(0, 0, 3);
app.root.addChild(camera);

// Create a 2D screen
const screen = new pc.Entity();
screen.addComponent('screen', {
    referenceResolution: new pc.Vec2(settings.WIDTH, settings.HEIGHT),
    screenSpace: true
});
app.root.addChild(screen);

// Function to create and add a sprite to the screen
function addSprite(textureUrl, x, y, width, height, uv) {
    // Create a sprite entity
    const sprite = new pc.Entity();
    sprite.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        pivot: new pc.Vec2(0.5, 0.5),
        width: width,
        height: height,
        useInput: true
    });

    // Position the sprite
    sprite.setLocalPosition(x, y, 0);

    // Load the sprite texture
    app.assets.loadFromUrl(textureUrl, 'texture', (err, asset) => {
        if (!err) {
            sprite.element.texture = asset.resource;
            sprite.element.rect = uv;
        }
    });

    // Add the sprite to the screen
    screen.addChild(sprite);
}

addSprite('Assets/Desktop.png', -2, 1, 128, 128, new pc.Vec4(0, 0, 1, 1));

window.addEventListener('resize', () => {
    app.resizeCanvas(canvas.width, canvas.height);
});