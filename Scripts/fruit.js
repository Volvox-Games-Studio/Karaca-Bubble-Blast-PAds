import * as pc from 'playcanvas';


var Fruit = pc.createScript('fruit');

// Initialize function: called when the component is initialized
Fruit.prototype.initialize = function () {
    this.speed = 10;
    this.radius = 0.35;
};

// Update function: called every frame
Fruit.prototype.update = function (dt) {
    this.updateWallCollision();
    this.updateMovement(dt);
};


Fruit.prototype.setDirection = function (direction) {
    this.direction = direction;
}


Fruit.prototype.updateMovement = function (dt) {
    this.entity.translate(this.direction.x * this.speed * dt, this.direction.y * this.speed * dt, 0);
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
