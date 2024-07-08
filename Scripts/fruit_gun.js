import * as pc from 'playcanvas';
import * as input from './input'
import * as setting from './settings'
import * as assets from './assets'


var FruitGun = pc.createScript('fruitGun');

// Initialize function: called when the component is initialized
FruitGun.prototype.initialize = function () {
    input.EVENTS.addEventListener('touchEnd', this.onTouchEnd.bind(this));
    this.entity.setPosition(0, -setting.ORTHO_SIZE + 1, 0);
    this.spawnPoint = new pc.Entity();
    this.entity.addChild(this.spawnPoint);
    this.spawnPoint.addComponent('model', {
        type: 'box'
    })
    this.spawnPoint.setLocalScale(0.1, 0.1, 0.1);
    this.spawnPoint.setLocalPosition(0, 1, 0);
    this.fruitIndices = [0, 1, 2, 3, 4, 5]
    this.shootIndex = 0;
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
};

FruitGun.prototype.onTouchEnd = function () {
    var index = this.fruitIndices[this.shootIndex];

    this.shootIndex = (this.shootIndex + 1) % this.fruitIndices.length;

    this.shoot(index);
}   


FruitGun.prototype.shoot = function (index) {
    var entity = new pc.Entity();

    entity.addComponent('script');
    entity.script.create('fruit');
    entity.setPosition(this.spawnPoint.getPosition());
    entity.script.fruit.fruitCollisionEnabled = true;
    entity.script.fruit.speed = 10.0;
    entity.script.fruit.direction = this.direction;
    entity.script.fruit.fruitSpawner = this.fruitSpawner;
    entity.addChild(assets.fruitSprites[index].clone());
    this.root.addChild(entity);
}

FruitGun.prototype.setRoot = function (root) {
    this.root = root;
}
