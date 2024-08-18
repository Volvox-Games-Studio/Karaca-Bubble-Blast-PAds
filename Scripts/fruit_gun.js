import * as pc from 'playcanvas';
import * as input from './input'
import * as setting from './settings'
import * as assets from './assets'
import * as events from './events'
import * as ease from './easing'
import * as tween from './tween'
import * as random from './random'


var FruitGun = pc.createScript('fruitGun');

// Initialize function: called when the component is initialized
FruitGun.prototype.initialize = function () {
    input.EVENTS.addEventListener('touchEnd', this.onTouchEnd.bind(this));
    events.FRUIT_GUN.addEventListener('onReload', this.onReload.bind(this));
    this.entity.setPosition(0, -setting.ORTHO_SIZE + 2, 0);
    this.spawnPoint = new pc.Entity();
    this.entity.addChild(this.spawnPoint);
    this.spawnPoint.setLocalPosition(0, 1.7, 0);
    this.fruitIndices = []
    this.shootIndex = 0;

    for (let i = 0; i < 1000; i++) {
        this.fruitIndices.push(random.range(0, 6));
    }
};

// Update function: called every frame
FruitGun.prototype.update = function (dt) {
    const position = this.entity.getPosition();
    const deltaX = input.TOUCH_X - position.x;
    const deltaY = input.TOUCH_Y - position.y;
    const angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90;

    this.direction = new pc.Vec2(deltaX, deltaY);
    this.direction.normalize();
    this.entity.setEulerAngles(0, 0, angleInDegrees);
    this.moveLoadedFruit();
};

FruitGun.prototype.onTouchEnd = function () {
    this.shoot();
}  

FruitGun.prototype.onReload = function () {
    this.loadNext();
}


FruitGun.prototype.loadNext = function () {
    var entity = new pc.Entity();
    var index = this.fruitIndices[this.shootIndex];

    this.shootIndex = (this.shootIndex + 1) % this.fruitIndices.length;

    entity.addComponent('script');
    entity.script.create('fruit');
    entity.setPosition(this.spawnPoint.getPosition());
    entity.script.fruit.index = index;
    entity.script.fruit.fruitSpawner = this.fruitSpawner;
    entity.addChild(assets.fruitSprites[index].clone());
    this.root.addChild(entity);
    this.loadedFruit = entity.script.fruit;
    this.loadedFruit.speed = 0.0;
    this.loadedFruit.direction = new pc.Vec3(0, 0, 0);
    this.loadedFruit.fruitCollisionEnabled = false;
}

FruitGun.prototype.shoot = function () {
    if (typeof this.loadedFruit === 'undefined') return;

    this.loadedFruit.speed = 12.0;
    this.loadedFruit.direction = this.direction;
    this.loadedFruit.fruitCollisionEnabled = true;
    this.loadedFruit = undefined;

    var duration = 0.25;
    var distance = 0.8;
    var position = this.entity.getPosition();
    var endPosition = new pc.Vec3(position.x - this.direction.x * distance, position.y - this.direction.y * distance, position.z);

    tween.move(this.entity, endPosition, duration, ease.harmonicCirc);
    tween.scale(this.entity, new pc.Vec3(1.2, 0.8, 1.0), duration, ease.harmonicCirc);
}

FruitGun.prototype.setRoot = function (root) {
    this.root = root;
}

FruitGun.prototype.moveLoadedFruit = function (root) {
    if (typeof this.loadedFruit === 'undefined') return;

    this.loadedFruit.entity.setPosition(this.spawnPoint.getPosition());
}
