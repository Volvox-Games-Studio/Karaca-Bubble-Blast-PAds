import * as pc from 'playcanvas';


var Fruit = pc.createScript('fruit');

Fruit.attributes.add('speed', { type: 'number', default: 10 });

// Initialize function: called when the component is initialized
Fruit.prototype.initialize = function () {
    
};

// Update function: called every frame
Fruit.prototype.update = function (dt) {
    this.entity.translate(this.direction.x * this.speed * dt, this.direction.y * this.speed * dt, 0);
};


Fruit.prototype.setDirection = function (direction) {
    this.direction = direction;
}
