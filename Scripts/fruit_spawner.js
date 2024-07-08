import * as pc from 'playcanvas';
import * as assets from './assets'


var FruitSpawner = pc.createScript('fruitSpawner');

// Initialize function: called when the component is initialized
FruitSpawner.prototype.initialize = function () {
    var initialFruits = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
    ];
    
    this.y = 8.0
    this.cellSize = 1;
    this.fruits = [
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    ];
    
    for (let i = 0; i < initialFruits.length; i++) {
        for (let j = 0; j < initialFruits[i].length; j++) {
            var entity = new pc.Entity();
            entity.addComponent('script');
            entity.script.create('fruit');
            entity.script.fruit.speed = 0;
            entity.script.fruit.direction = new pc.Vec3(0, 0, 0);
            entity.script.fruit.fruitSpawner = this;
            entity.script.fruit.fruitCollisionEnabled = false;
            entity.setPosition(new pc.Vec3((j - (this.fruits[i].length - 1) * 0.5) * this.cellSize, this.y - i * this.cellSize, 0));
            entity.addChild(assets.fruitSprites[initialFruits[i][j]].clone());
            
            this.root.addChild(entity);
            this.fruits[i][j] = entity.script.fruit;
        }
    }
};

// Update function: called every frame
FruitSpawner.prototype.update = function (dt) {
    
};


FruitSpawner.prototype.collidedFruit = function (otherFruit) {
    for (let i = 0; i < this.fruits.length; i++) {
        for (let j = 0; j < this.fruits[i].length; j++) {
            var fruit = this.fruits[i][j];

            if (typeof fruit === 'undefined') continue;

            if (fruit.isCollide(otherFruit)) return fruit;
        }
    }

    return undefined;
}

FruitSpawner.prototype.snapOrBounceFruit = function (fruit, otherFruit) {
    var position = fruit.entity.getPosition();
    var otherPosition = otherFruit.entity.getPosition();
    var i = Math.round((this.y - position.y) / this.cellSize);
    var j = Math.round((position.x / this.cellSize) + (this.fruits[0].length - 1) * 0.5);

    if (j < 0) j = 0;
    if (j >= this.fruits[i].length) j = this.fruits[0].length - 1;

    var isLeftCollided = otherPosition.x < position.x;
    var upperFruit = this.fruits[i - 1][j];

    if (typeof upperFruit === 'undefined')
    {
        if (isLeftCollided && fruit.direction.x < 0)
        {
            fruit.direction.x *= -1;
        }
        else if (!isLeftCollided && fruit.direction.x > 0)
        {
            fruit.direction.x *= -1;
        }

        return;
    }

    this.fruits[i][j] = fruit;
    fruit.speed = 0.0;
    fruit.fruitCollisionEnabled = false;
    fruit.entity.setPosition(new pc.Vec3((j - (this.fruits[0].length - 1) * 0.5) * this.cellSize, this.y - i * this.cellSize, 0));
}