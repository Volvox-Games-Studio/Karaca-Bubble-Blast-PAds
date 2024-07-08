import * as pc from 'playcanvas';


var Fruit = pc.createScript('fruit');

Fruit.attributes.add('speed', { type: 'number', default: 0.0 });

// Initialize function: called when the component is initialized
Fruit.prototype.initialize = function () {
    this.scale = 1.2;
    this.radius = this.scale * 0.35;
    this.entity.setLocalScale(this.scale, this.scale, this.scale);
};

// Update function: called every frame
Fruit.prototype.update = function (dt) {
    this.updateFruitCollision();
    this.updateWallCollision();
    this.updateMovement(dt);
};


Fruit.prototype.updateMovement = function (dt) {
    this.entity.translate(this.direction.x * this.speed * dt, this.direction.y * this.speed * dt, 0);
}

Fruit.prototype.updateFruitCollision = function () {
    if (!this.fruitCollisionEnabled) return;

    var collidedFruit = this.fruitSpawner.collidedFruit(this);

    if (typeof collidedFruit === 'undefined') return
    
    this.fruitSpawner.snapOrBounceFruit(this, collidedFruit);
}

Fruit.prototype.updateWallCollision = function () {
    var position = this.entity.getPosition();
    var xMin = position.x - this.radius;
    var xMax = position.x + this.radius;

    if (xMin < -4.6 && this.direction.x < 0)
    {
        this.direction.x *= -1;
    }

    else if (xMax > 4.6 && this.direction.x > 0)
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
