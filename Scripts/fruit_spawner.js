import * as pc from 'playcanvas';
import * as assets from './assets'


var FruitSpawner = pc.createScript('fruitSpawner');

// Initialize function: called when the component is initialized
FruitSpawner.prototype.initialize = function () {
    var initialFruits = [
        [0, 0, 0, 0, 0, 0, 1, 0],
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
            var index = initialFruits[i][j];
            entity.addComponent('script');
            entity.script.create('fruit');
            entity.script.fruit.speed = 0;
            entity.script.fruit.direction = new pc.Vec3(0, 0, 0);
            entity.script.fruit.index = index;
            entity.script.fruit.fruitSpawner = this;
            entity.script.fruit.fruitCollisionEnabled = false;
            entity.setPosition(this.gridToWorldPosition(i, j));
            entity.addChild(assets.fruitSprites[index].clone());
            
            this.root.addChild(entity);
            this.fruits[i][j] = entity.script.fruit;
        }
    }
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

FruitSpawner.prototype.snapFruit = function (fruit, i, j) {
    this.fruits[i][j] = fruit;
    fruit.speed = 0.0;
    fruit.fruitCollisionEnabled = false;
    fruit.entity.setPosition(this.gridToWorldPosition(i, j));

    this.checkMatches(i, j);
    this.checkFalloff();
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