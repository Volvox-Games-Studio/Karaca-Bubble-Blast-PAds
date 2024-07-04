import * as pc from 'playcanvas';
import * as input from './input'


var FruitGun = pc.createScript('fruitGun');

// Initialize function: called when the component is initialized
FruitGun.prototype.initialize = function () {
    
};

// Update function: called every frame
FruitGun.prototype.update = function (dt) {
    const position = this.entity.getPosition();
    const deltaX = input.TOUCH_X - position.x;
    const deltaY = input.TOUCH_Y - position.y;
    const angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90;

    this.entity.setEulerAngles(0, 0, angleInDegrees);
};
