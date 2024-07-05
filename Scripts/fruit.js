import * as pc from 'playcanvas';


var Fruit = pc.createScript('fruit');

Fruit.attributes.add('speed', { type: 'number', default: 0.0 });

// Initialize function: called when the component is initialized
Fruit.prototype.initialize = function () {
    this.radius = 0.35;
};

// Update function: called every frame
Fruit.prototype.update = function (dt) {
    this.updateWallCollision();
    this.updateMovement(dt);
};


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
