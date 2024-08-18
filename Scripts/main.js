import * as pc from 'playcanvas';
import * as settings from './settings'
import * as assets from './assets'
import * as input from './input'
import * as tween from './tween'
import * as easing from './easing'


// satisfy facebook
window.FBPlayableOnCTAClick();

// create an application
const canvas = document.getElementById('application');
const dummyApp = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});
dummyApp.setCanvasResolution(pc.RESOLUTION_AUTO);
dummyApp.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);

var width = canvas.clientWidth;
var height = canvas.clientHeight;

settings.setAspectRatio(width / height);

const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
});
app.setCanvasResolution(pc.RESOLUTION_FIXED, settings.WIDTH, settings.HEIGHT);
app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT);
app.start();

settings.setSize(width, height);

const touch = app.touch;

touch.on(pc.EVENT_TOUCHSTART, (event) => input.onTouchStart(camera, event));
touch.on(pc.EVENT_TOUCHMOVE, (event) => input.onTouchMove(camera, event));
touch.on(pc.EVENT_TOUCHEND, input.onTouchEnd);

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

assets.loadBackgroundSprites(app, () => {
    assets.loadFruitSprites(app, () => {
        assets.loadFruitGunSprite(app, () => {
            assets.loadFruitPop(app, () => {
                assets.loadHandSprite(app, start)
            });
        })  
    })  
})

function start()
{
    createBackground();

    var fruitGun = createFruitGun();
    var fruitSpawner = createFruitSpawner();

    fruitGun.fruitSpawner = fruitSpawner;

    playTutorialHand();
}

function createBackground()
{
    var background = new pc.Entity();
    var gridBackground =  new pc.Entity();

    background.addChild(assets.backgroundSprite);
    gridBackground.addChild(assets.gridBackgroundSprite);

    gridBackground.setPosition(-0.05, 1.55, 0);

    app.root.addChild(background);
    app.root.addChild(gridBackground);
}

function createFruitGun()
{
    var entity = new pc.Entity();

    entity.addComponent('script');
    entity.script.create('fruitGun');
    entity.addChild(assets.fruitGunSprite);

    entity.script.fruitGun.setRoot(app.root);

    app.root.addChild(entity);

    return entity.script.fruitGun;
}

function createFruitSpawner()
{
    var entity = new pc.Entity();

    entity.addComponent('script');
    entity.script.create('fruitSpawner');
    entity.script.fruitSpawner.root = app.root;
    
    app.root.addChild(entity);

    return entity.script.fruitSpawner;
}

async function playTutorialHand()
{
    var hand = new pc.Entity();

    hand.addComponent('script');
    hand.script.create('destroyOnTouch');
    hand.setPosition(new pc.Vec3(0, -1, 0));

    hand.addChild(assets.handSprite);
    assets.handSprite.setLocalPosition(new pc.Vec3(0.65, 0, 0));

    app.root.addChild(hand);

    while (true)
    {
        await tween.scale(hand, new pc.Vec3(1.5, 1.5, 1.5), 0.25, easing.outSine);
        await tween.scale(hand, new pc.Vec3(1, 1, 1), 0.25, easing.inSine);
    }
}
