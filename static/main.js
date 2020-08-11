var webSocket = new WebSocket("ws://localhost:8080/ws");

function connectToServer() {
    console.log("Attempting Connection...");

    webSocket.onopen = () => {
        console.log("Successfully Connected");
        connected = true
    };

    webSocket.onmessage = msg => {
        console.log(msg);
    };

    webSocket.onclose = event => {
        console.log("Socket Closed Connection: ", event);
    };

    webSocket.onerror = error => {
        console.log("Socket Error: ", error);
    };
};
connectToServer();
function sendMsg(msg) {
    console.log("sending msg: ", msg);
    webSocket.send(msg);
};

var connected = false
var cnv;
var snake;
var scl = 20;
var food;
var gameField;
var bestscore = 0;

function setup() {
    cnv = createCanvas(600, 440);
    centerCanvas();
    gameField = createGraphics(401, 401);
    gameField.paddingLeft = 20;
    gameField.paddingTop = 20;
    snake = new Snake(gameField, scl);
    frameRate(1);
    pickLocation();
}

function draw() {
    clear();
    if (!connected) {
        text("connecting...", 450, 40);
        return
    }
    snake.update();
    sendMsg(snake.headX + " " + snake.headY);

    if (snake.hits([snake])) {
        if (snake.length - 4 > bestscore) bestscore = snake.length - 4;
        setup();
        return
    }

    background("#a38d72");
    drawGameField();
    snake.draw();

    if (snake.eat(food)) {
        pickLocation();
    }

    drawFood();
    drawScore();

    //Adds gamefield to the canvas
    image(gameField, gameField.paddingLeft, gameField.paddingTop);
}

function drawGameField() {
    gameField.fill("#b28957");
    gameField.rect(0, 0, gameField.width - 1, gameField.height - 1);
}

function drawFood() {
    gameField.fill("#ff0000");
    gameField.rect(food.x, food.y, scl, scl);
}

function drawScore() {
    fill(0);
    text("current score: " + (snake.length - 4), 450, 40);
    text("best score: " + bestscore, 450, 80);
}

//this functionality will be transfered to the server
function pickLocation() {
    let cols = floor(gameField.width / scl);
    let rows = floor(gameField.height / scl);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);
    for (var i = 0; i < snake.tail.length; i++) {
        if (food.x === snake.tail[i].x && food.y === snake.tail[i].y) {
            pickLocation();
            break;
        }
    }
    if (snake.headX === food.x && snake.headY === food.y) { pickLocation(); }
}

function windowResized() {
    centerCanvas();
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        snake.turnUp()
    } else if (keyCode === LEFT_ARROW) {
        snake.turnLeft()
    } else if (keyCode === DOWN_ARROW) {
        snake.turnDown()
    } else if (keyCode === RIGHT_ARROW) {
        snake.turnRight()
    }
}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
}