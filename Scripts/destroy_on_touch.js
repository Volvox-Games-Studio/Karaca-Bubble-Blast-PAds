import * as pc from 'playcanvas';
import * as input from './input'


var DestroyOnTouch = pc.createScript('destroyOnTouch');

// Initialize function: called when the component is initialized
DestroyOnTouch.prototype.initialize = function () {
    input.EVENTS.addEventListener('touchStart', this.onTouchStart.bind(this));
};

// Update function: called every frame
DestroyOnTouch.prototype.update = function (dt) {
    
};


DestroyOnTouch.prototype.onTouchStart = function () {
    this.entity.destroy();
}
