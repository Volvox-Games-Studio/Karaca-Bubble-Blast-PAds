import * as pc from 'playcanvas';
import * as assets from './assets'
import * as ease from './easing'
import * as tween from './tween'
import * as events from './events'
import { waitNextFrame } from './async';


var FruitSpawner = pc.createScript('fruitSpawner');

// Initialize function: called when the component is initialized
FruitSpawner.prototype.initialize = async function () {    
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

    var initialRows = [
        [5, undefined, undefined, undefined, undefined, undefined, undefined, 5],
        [5, undefined, undefined, undefined, undefined, undefined, undefined, 5],
        [5, undefined, undefined, undefined, undefined, undefined, undefined, 5],
        [5, undefined, undefined, undefined, undefined, undefined, undefined, 5],
        [5, undefined, undefined, undefined, undefined, undefined, undefined, 5]
    ];

    this.queue = [
        [5, 5, 5, 5, 5, 5, 5, 5],
        [5, 0, 1, 2, 5, 3, 4, 5],
        [5, 0, 1, 2, 5, 3, 4, 5],
        [5, 0, 1, 2, 5, 3, 4, 5],
        [5, 0, 1, 2, 5, 3, 4, 5],
        [5, 0, 1, 2, 5, 3, 4, 5]
    ];

    for (let i = initialRows.length - 1; i >= 0; i--) {
        const row = initialRows[i];
        
        await this.pushNewRow(row)
    }

    this.reloadFruitGun();
};

// Update function: called every frame
FruitSpawner.prototype.update = function (dt) {
    
};


FruitSpawner.prototype.gridToWorldPosition = function (i, j) {
    return new pc.Vec3((j - (this.fruits[i].length - 1) * 0.5) * this.cellSize, this.y - i * this.cellSize, 0)
}

FruitSpawner.prototype.worldToGridPosition = function (position) {
    var i = Math.round((this.y - position.y) / this.cellSize);
    var j = Math.round((position.x / this.cellSize) + (this.fruits[0].length - 1) * 0.5);

    if (j < 0) j = 0;

    if (j >= this.fruits[i].length) j = this.fruits[0].length - 1;

    return [i, j];
}

FruitSpawner.prototype.checkCollisitionWithTop = function (fruit) {
    var yMax = this.gridToWorldPosition(0, 0).y;
    var position = fruit.entity.getPosition();
    var isColliding = position.y >= yMax;

    if (!isColliding) return false;

    var gridPosition = this.worldToGridPosition(position);
    var i = gridPosition[0];
    var j = gridPosition[1];

    this.snapFruit(fruit, i, j);
    return true;
}

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
    var gridPosition = this.worldToGridPosition(position);
    var i = gridPosition[0];
    var j = gridPosition[1];

    if (i > 0)
    {
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
    }

    this.snapFruit(fruit, i, j);
}

FruitSpawner.prototype.snapFruit = async function (fruit, i, j) {
    this.fruits[i][j] = fruit;
    fruit.speed = 0.0;
    fruit.fruitCollisionEnabled = false;

    await tween.move(fruit.entity, this.gridToWorldPosition(i, j), 0.20, ease.outSine);

    this.checkMatches(i, j);
    this.checkFalloff();

    await this.pushNextRowFromQueue();

    this.reloadFruitGun();
}

FruitSpawner.prototype.checkMatches = function (startI, startJ) {
    const rows = this.fruits.length;
    const cols = this.fruits[0].length;
    const targetValue = this.fruits[startI][startJ].index;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], // Right, Down, Left, Up
    ];

    function isValid(i, j) {
        return i >= 0 && i < rows && j >= 0 && j < cols;
    }

    function dfs(array, i, j) {
        const stack = [[i, j]];
        const result = [];

        while (stack.length > 0) {
            const [ci, cj] = stack.pop();

            if (typeof array[ci] === 'undefined' || typeof array[ci][cj] === 'undefined') {
                continue;
            }

            if (!isValid(ci, cj) || visited[ci][cj] || array[ci][cj].index !== targetValue) {
                continue;
            }

            visited[ci][cj] = true;
            result.push([ci, cj]);

            for (const [di, dj] of directions) {
                const ni = ci + di;
                const nj = cj + dj;
                stack.push([ni, nj]);
            }
        }

        return result;
    }

    var matches = dfs(this.fruits, startI, startJ);

    if (matches.length < 3) return;

    for (let index = 0; index < matches.length; index++) {
        const element = matches[index];
        const i = element[0];
        const j = element[1];
        const fruit = this.fruits[i][j];

        fruit.pop();
        this.fruits[i][j] = undefined;
    }
}

FruitSpawner.prototype.checkFalloff = function () {
    for (let i = 1; i < this.fruits.length; i++) {
        for (let j = 0; j < this.fruits[i].length; j++) {
            var fruit = this.fruits[i][j];

            if (typeof fruit === 'undefined') continue;

            var upperFruit = this.fruits[i - 1][j];

            if (typeof upperFruit === 'undefined')
            {
                this.fruits[i][j] = undefined;
                fruit.fall();
            }
        }
    }
}

FruitSpawner.prototype.pushNextRowFromQueue = async function () {
    if (this.queue.length <= 0) return;

    const row = this.queue.pop();

    await this.pushNewRow(row);
}

FruitSpawner.prototype.pushNewRow = async function (row) {
    var currentTime = performance.now() / 1000;
    var t = 0.0;
    var flag = true;

    while (flag)
    {
        var speed = 3.0;
        var time = performance.now() / 1000;
        var dt = time - currentTime;
        currentTime = time;

        t += dt * speed;

        if (t > 1.0)
        {
            t = 1.0;
            flag = false;
        }

        for (let i = 0; i < this.fruits.length; i++) {
            for (let j = 0; j < this.fruits[i].length; j++) {
                var fruit = this.fruits[i][j];

                if (typeof fruit === 'undefined') continue;

                var startPos = this.gridToWorldPosition(i, j);
                var endPos = new pc.Vec3(startPos.x, startPos.y - 1, startPos.z);

                const newPos = new pc.Vec3();
                newPos.lerp(startPos, endPos, ease.outSine(t));

                fruit.entity.setPosition(newPos);
            }
        }

        await waitNextFrame();
    }

    this.fruits.unshift([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);

    for (let j = 0; j < row.length; j++) {
        var entity = new pc.Entity();
            var index = row[j];

            if (typeof index === 'undefined') continue;

            entity.addComponent('script');
            entity.script.create('fruit');
            entity.script.fruit.speed = 0;
            entity.script.fruit.direction = new pc.Vec3(0, 0, 0);
            entity.script.fruit.index = index;
            entity.script.fruit.fruitSpawner = this;
            entity.script.fruit.fruitCollisionEnabled = false;
            entity.setPosition(this.gridToWorldPosition(0, j));
            entity.addChild(assets.fruitSprites[index].clone());
            
            this.root.addChild(entity);
            this.fruits[0][j] = entity.script.fruit;
    }
}

FruitSpawner.prototype.reloadFruitGun = function () {
    events.FRUIT_GUN.dispatchEvent(new CustomEvent('onReload'));
}