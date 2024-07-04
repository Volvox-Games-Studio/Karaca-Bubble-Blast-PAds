import * as pc from 'playcanvas';
import * as settings from './settings'
import * as assets from './assets'
import * as input from './input'


// create an application
const canvas = document.getElementById('application');
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});
app.setCanvasResolution(pc.RESOLUTION_FIXED, settings.WIDTH, settings.HEIGHT);
app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT);
app.start();

const touch = app.touch;

touch.on(pc.EVENT_TOUCHMOVE, input.onTouchMove);

// create a camera
const camera = new pc.Entity();
camera.addComponent('camera', {
    clearColor: new pc.Color(0.3, 0.3, 0.7),
    projection: pc.PROJECTION_ORTHOGRAPHIC,
    orthoHeight: settings.ORTHO_SIZE,
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


window.addEventListener('resize', () => {
    app.resizeCanvas(canvas.width, canvas.height);
});

assets.loadFruitGunSprite(app, () => {
    assets.loadFruitSprites(app, start);
})


function start()
{
    const fruitGun = assets.fruitGunSprite;
    fruitGun.addComponent('script');
    fruitGun.script.create('fruitGun');

    screen.addChild(fruitGun);
}
