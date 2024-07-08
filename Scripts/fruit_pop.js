import * as pc from 'playcanvas';
import * as assets from './assets'
import * as tween from './tween'
import * as ease from './easing'
import { waitForSeconds } from './async';


var FruitPop = pc.createScript('fruitPop');

// Initialize function: called when the component is initialized
FruitPop.prototype.initialize = function () {

};

// Update function: called every frame
FruitPop.prototype.update = function (dt) {
    
};


FruitPop.prototype.animate = async function (index) {
    this.sprite = assets.fruitPopSprite.clone();
    this.entity.addChild(this.sprite);
    this.setColorByFruitIndex(index);

    tween.scale(this.entity, new pc.Vec3(3, 3, 3), 8 * 0.03, ease.outSine);

    for (let i = 0; i < 9; i++) {
        this.setFrameIndex(i);
        await waitForSeconds(0.03);
    }

    this.entity.destroy();
};

FruitPop.prototype.setColorByFruitIndex = function (index) {
    var color = new pc.Color(1, 1, 1, 1);
    
    if (index == 0) {
        color.r = 0.901960;
        color.g = 0.870588;
        color.b = 0.815686;
    }
    else if (index == 1) {
        color.r = 0.988235;
        color.g = 0.929411;
        color.b = 0.509803;
    }
    else if (index == 2) {
        color.r = 0.560784;
        color.g = 0.725490;
        color.b = 0.243137;
    }
    else if (index == 3) {
        color.r = 0.219607;
        color.g = 0.356862;
        color.b = 0.611764;
    }
    else if (index == 4) {
        color.r = 0.474509;
        color.g = 0.301960;
        color.b = 0.537254;
    }
    else if (index == 5) {
        color.r = 0.866667;
        color.g = 0.188235;
        color.b = 0.192156;
    }

    this.sprite.element.color = color;
}

FruitPop.prototype.setFrameIndex = function (index) {
    var x = 0.0;
    var y = 0.0;
    var size = 1 / 3;

    if (index == 0) {
        x = 0 / 3;
        y = 2 / 3;
    }
    else if (index == 1) {
        x = 1 / 3;
        y = 2 / 3;
    }
    else if (index == 2) {
        x = 2 / 3;
        y = 2 / 3;
    }
    else if (index == 3) {
        x = 0 / 3;
        y = 1 / 3;
    }
    else if (index == 4) {
        x = 1 / 3;
        y = 1 / 3;
    }
    else if (index == 5) {
        x = 2 / 3;
        y = 1 / 3;
    }
    else if (index == 6) {
        x = 0 / 3;
        y = 0 / 3;
    }
    else if (index == 7) {
        x = 1 / 3;
        y = 0 / 3;
    }
    else if (index == 8) {
        x = 2 / 3;
        y = 0 / 3;
    }

    this.sprite.element.rect = new pc.Vec4(x, y, size, size);
};
