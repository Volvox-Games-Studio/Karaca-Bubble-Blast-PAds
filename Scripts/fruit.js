import * as pc from 'playcanvas';


var Fruit = pc.createScript('fruit');

Fruit.attributes.add('speed', { type: 'number', default: 0.0 });

// Initialize function: called when the component is initialized
Fruit.prototype.initialize = function () {
    this.isFalling = false;
    this.scale = 1.2;
    this.radius = this.scale * 0.35;
    this.acceleration = 0.0;
    this.entity.setLocalScale(this.scale, this.scale, this.scale);
};

// Update function: called every frame
Fruit.prototype.update = function (dt) {
    this.updateFruitCollision();
    this.updateWallCollision();
    this.updateMovement(dt);
    this.cleanUpAfterFall();
};


Fruit.prototype.updateMovement = function (dt) {
    this.speed += this.acceleration * dt;
    this.entity.translate(this.direction.x * this.speed * dt, this.direction.y * this.speed * dt, 0);
}

Fruit.prototype.updateFruitCollision = function () {
    if (!this.fruitCollisionEnabled) return;

    if (this.fruitSpawner.checkCollisitionWithTop(this)) return;

    var collidedFruit = this.fruitSpawner.collidedFruit(this);

    if (typeof collidedFruit === 'undefined') return
    
    this.fruitSpawner.snapOrBounceFruit(this, collidedFruit);
}

Fruit.prototype.updateWallCollision = function () {
    var position = this.entity.getPosition();
    var xMin = position.x - this.radius;
    var xMax = position.x + this.radius;
    var border = 4.3

    if (xMin < -border && this.direction.x < 0)
    {
        this.direction.x *= -1;
    }

    else if (xMax > border && this.direction.x > 0)
    {
        this.direction.x *= -1;
    }
}


Fruit.prototype.isCollide = function (otherFruit) {
    var a = this.entity.getPosition();
    var b = otherFruit.entity.getPosition();
    var distance = a.distance(b);

    return distance <= (this.radius * 2) * 1;
}

Fruit.prototype.pop = function () {
    var entity = new pc.Entity();

    entity.setPosition(this.entity.getPosition());
    entity.addComponent('script');
    entity.script.create('fruitPop');
    entity.script.fruitPop.animate(this.index);
    this.app.root.addChild(entity);

    this.entity.destroy();
}

Fruit.prototype.fall = function () {
    this.isFalling = true;
    this.acceleration = 20.0;
    this.direction = new pc.Vec2(0, -1);
}

Fruit.prototype.cleanUpAfterFall = function () {
    if (!this.isFalling) return;

    var position = this.entity.getPosition();

    if (position.y > -20) return;

    this.pop();
}
