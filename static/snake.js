function Snake(gameField, scale) {
    this.length = 4;
    this.headY = 0;
    this.headX = this.length * scale;
    this.speedX = 1;
    this.speedY = 0;
    this.tail = [];
    this.bufferDirection = { x: 2, y: 2, nextX: 2, nextY: 2 };
    for (var i = 0; i < this.length - 1; i++) {
        this.tail[i] = createVector((this.length - 1 - i) * scale, 0);
    }

    this.update = function () {
        this._moveTail();
        this._countVelocity();
        this._moveHead();
    };

    this._moveTail = function () {
        this.tail.pop();
        this.tail.unshift(createVector(this.headX, this.headY));
    }

    this._moveHead = function () {
        this.headX += this.speedX * scale;
        this.headY += this.speedY * scale;
        this.headX = constrain(this.headX, 0, gameField.width - 1 - scale);
        this.headY = constrain(this.headY, 0, gameField.height - 1 - scale);
    }

    //Velocity is calculated with the buffer in mind(e.g. if you are moving up you can instantly click left and down to make a turn).
    // Number 2 is an indicator that the buffer direction is NOT in use, because numbers -1, 0, 1 are used for providing speed and its direction
    this._countVelocity = function () {
        if (this.bufferDirection.x !== 2 &&
            this.bufferDirection.y !== 2 &&
            this.speedY !== this.bufferDirection.y &&
            this.speedX !== this.bufferDirection.x
        ) {
            this.speedX = this.bufferDirection.x;
            this.speedY = this.bufferDirection.y;
            this.bufferDirection.x = 2;
            this.bufferDirection.y = 2;
        } else if (this.bufferDirection.x === 2 &&
            this.bufferDirection.y === 2 &&
            this.bufferDirection.nextX !== 2 &&
            this.bufferDirection.nextY !== 2
        ) {
            this.speedX = this.bufferDirection.nextX;
            this.speedY = this.bufferDirection.nextY;
            this.bufferDirection.nextY = 2;
            this.bufferDirection.nextX = 2;
        }
    }

    this.draw = function () {
        gameField.fill("#911f0b");
        gameField.rect(this.headX, this.headY, scale, scale);
        gameField.fill("#1d5b0d");
        for (var i = 0; i < this.tail.length; i++) {
            gameField.rect(this.tail[i].x, this.tail[i].y, scale, scale)
        }
    };

    this.eat = function (pos) {
        var d = dist(this.headX, this.headY, pos.x, pos.y);
        if (d < 1) {
            this.tail.push(createVector(this.tail[this.tail.length - 1].x, this.tail[this.tail.length - 1].y));
            this.length++;
            return true;
        } else {
            return false
        }
    };

    this.hits = function (snakes) {
        //this works on constrains because they don't allow to move first rectangle further 
        //and second rectangle bumps into the first one and causes death of the snake
        for (var j = 0; j < snakes.length; j++) {
            for (var i = 0; i < this.tail.length; i++) {
                if (this.headX === snakes[j].tail[i].x && this.headY === snakes[j].tail[i].y) {
                    return true;
                }
            }
        }
        return false;
    }

    this.turnUp = function () {
        if (this.bufferDirection.x === 2 && this.bufferDirection.y === 2 && snake.speedX !== 0) {
            this.bufferDirection.y = -1;
            this.bufferDirection.x = 0;
        } else if (
            this.bufferDirection.y !== -1
            && this.bufferDirection.nextY === 2
            && this.bufferDirection.nextX === 2
            && this.bufferDirection.x !== 0
            && this.bufferDirection.y !== 2
            && this.bufferDirection.x !== 2
        ) {
            this.bufferDirection.nextY = -1;
            this.bufferDirection.nextX = 0;
        }
    }

    this.turnLeft = function () {
        if (this.bufferDirection.x === 2 && this.bufferDirection.y === 2 && snake.speedY !== 0) {
            this.bufferDirection.y = 0;
            this.bufferDirection.x = -1;
        } else if (
            this.bufferDirection.x !== -1
            && this.bufferDirection.nextY === 2
            && this.bufferDirection.nextX === 2
            && this.bufferDirection.y !== 0
            && this.bufferDirection.y !== 2
            && this.bufferDirection.x !== 2
        ) {
            this.bufferDirection.nextY = 0;
            this.bufferDirection.nextX = -1;
        }
    }

    this.turnDown = function () {
        if (this.bufferDirection.x === 2 && this.bufferDirection.y === 2 && snake.speedX !== 0) {
            this.bufferDirection.y = 1;
            this.bufferDirection.x = 0;
        } else if (
            this.bufferDirection.y !== 1
            && this.bufferDirection.nextY === 2
            && this.bufferDirection.nextX === 2
            && this.bufferDirection.x !== 0
            && this.bufferDirection.y !== 2
            && this.bufferDirection.x !== 2
        ) {
            this.bufferDirection.nextY = 1;
            this.bufferDirection.nextX = 0;
        }
    }

    this.turnRight = function () {
        if (this.bufferDirection.x === 2 && this.bufferDirection.y === 2 && snake.speedY !== 0) {
            this.bufferDirection.y = 0;
            this.bufferDirection.x = 1;
        } else if (
            this.bufferDirection.x !== 1
            && this.bufferDirection.nextY === 2
            && this.bufferDirection.nextX === 2
            && this.bufferDirection.y !== 0
            && this.bufferDirection.y !== 2
            && this.bufferDirection.x !== 2
        ) {
            this.bufferDirection.nextY = 0;
            this.bufferDirection.nextX = 1;
        }
    }
}
