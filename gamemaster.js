//Please wait warmly, document is preparing...
var boxSize = 15;
var lineSize = 2;
var sizeButton = document.createElement("button");
var canvas = document.createElement("canvas");
canvas.id = "gamescreen";
canvas.height = (boxSize + lineSize) * 29 + lineSize;
canvas.width = (boxSize + lineSize) * 29 + lineSize;
sizeButton.id = "resizeButton";
sizeButton.innerHTML = "Resize the game";
document.body.appendChild(sizeButton);
$("#resizeButton").on("mousedown", function() {
    resize();
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(canvas);
document.getElementById("gamescreen").style = "display: block; margin: 0 auto;";
$("*").on("keydown", function(event) {
    handleIt(event);
    event.stopPropagation();
});
//Document prep done by here, code below is the game    
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = "false";
var gameboard = makeBoard();
var gameWidth = $(canvas).width();
var gameHeight = $(canvas).height();
var handleAction = false;
var landed = false;
var clearForMovement = false;
var moveDirection = null;
var gameOver = false;
spawnBlocks();
var theBigLoop = setInterval(function() {
    gameLoop();
}, 150);
//Game functions below
function makeBoard() { //Javascript doesn't make 2D arrays with [][] so I put some arrays in my arrays
    var newBoard = new Array(29); //DIFFICULTY SLIDER: the board is 29x29 right now, might shrink it to 27x27
    for (var i = 0; i < 29; i++) {
        newBoard[i] = new Array(29);
    }
    for (var x = 0; x < 29; x++) { //bodyblocking setup
        for (var y = 0; y < 29; y++) {
            if ((x <= 6 || x >= 22) && (y <= 6 || y >= 22)) {
                newBoard[x][y] = 9;
            }
            else {
                newBoard[x][y] = 0;
            }
        }
    }
    newBoard[14][14] = 8;
    return newBoard;
}

function handleIt() { //Raid Leader
    if (!clearForMovement && !landed) {
        switch (event.which) { //37-40 left up right down
            case 37:
                moveDirection = "left";
                handleAction = true;
                break;
            case 38:
                moveDirection = "up";
                handleAction = true;
                break;
            case 39:
                moveDirection = "right";
                handleAction = true;
                break;
            case 40:
                moveDirection = "down";
                handleAction = true;
                break;
        }
    }
}

function resize() { //Leeet us zee if zis vurkz
    var newSize = prompt("Enter desired box size in pixels");
    if (newSize > 0) {
        boxSize = parseInt(newSize);
        gameWidth = (boxSize + lineSize) * 29 + lineSize; //gotta be large enough for 1 more line at the end of the squares + lines
        gameHeight = gameWidth;
        canvas.height = gameHeight;
        canvas.width = gameWidth;
        drawGame();
    }
}

function spinBoard(direction) { //LATER ADDITION: add rotatecounter //DIFFICULTY SLIDER: allow 2 rotations instead of 1
    if (direction === "right") { //rotate right 90 degrees

    }
    else if (direction === "left") { //rotate left 90 degrees

    }
}


function spawnBlocks() {
    var horizMin = 28;
    var horizMax = 0;
    var vertMin = 28;
    var vertMax = 0;
    var x = 0;
    var y = 0;
    var isEmpty = true;
    for (x = 7; x < 22; x++) {
        isEmpty = true;
        for (y = 7; y < 22; y++) {
            if (gameboard[x][y] > 0 && gameboard[x][y] != 9) {
                isEmpty = false;
            }
        }
        if (!isEmpty) {
            if (x < horizMin) {
                horizMin = x;
            }
            if (x > horizMax) {
                horizMax = x;
            }
        }
    }
    for (y = 7; y < 22; y++) {
        isEmpty = true;
        for (x = 7; x < 22; x++) {
            if (gameboard[x][y] > 0 && gameboard[x][y] != 9) {
                isEmpty = false;
            }
        }
        if (!isEmpty) {
            if (y < vertMin) {
                vertMin = y;
            }
            if (y > vertMax) {
                vertMax = y;
            }
        }
    }
    var seedblocksX;
    var seedblocksY;
    var whichBlock;
    var options;
    var optionChoice;
    //up
    seedblocksX = [0, 0, 0, 0];
    seedblocksY = [0, 0, 0, 0];
    whichBlock = 0;
    seedblocksX[0] = Math.floor(Math.random() * (horizMax - horizMin + 1)) + horizMin;
    seedblocksY[0] = Math.floor(Math.random() * 7);
    gameboard[seedblocksX[0]][seedblocksY[0]] = -1;
    for (var newBlock = 1; newBlock < 4; newBlock++) {
        whichBlock = Math.floor(Math.random() * newBlock);
        //consider options up down left right
        options = 0;
        if (seedblocksY[whichBlock] - 1 >= 0) {
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0) {
                options++;
            }
        }
        if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0 && seedblocksY[whichBlock] + 1 <= 6) {
            options++;
        }
        if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0) {
            options++;
        }
        if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0) {
            options++;
        }
        if (options === 0) { //if no options try again
            newBlock--;
        }
        else { //spawn next seedblock
            optionChoice = Math.floor(Math.random() * options); //chooses an option
            if (seedblocksY[whichBlock] - 1 >= 0) {
                if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0) {
                    if (optionChoice === 0) {
                        seedblocksX[newBlock] = seedblocksX[whichBlock];
                        seedblocksY[newBlock] = seedblocksY[whichBlock] - 1;
                    }
                    optionChoice--;
                }
            }
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0 && seedblocksY[whichBlock] + 1 <= 6) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock];
                    seedblocksY[newBlock] = seedblocksY[whichBlock] + 1;
                }
                optionChoice--;
            }
            if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock] - 1;
                    seedblocksY[newBlock] = seedblocksY[whichBlock];
                }
                optionChoice--;
            }
            if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock] + 1;
                    seedblocksY[newBlock] = seedblocksY[whichBlock];
                }
                optionChoice--;
            }
            gameboard[seedblocksX[newBlock]][seedblocksY[newBlock]] = -1;
        }
    }
    //down
    seedblocksX = [0, 0, 0, 0];
    seedblocksY = [0, 0, 0, 0];
    whichBlock = 0;
    seedblocksX[0] = Math.floor(Math.random() * (horizMax - horizMin + 1)) + horizMin;
    seedblocksY[0] = Math.floor(Math.random() * 7) + 22;
    gameboard[seedblocksX[0]][seedblocksY[0]] = -1;
    for (var newBlock = 1; newBlock < 4; newBlock++) {
        whichBlock = Math.floor(Math.random() * newBlock);
        //consider options up down left right
        options = 0;
        if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0 && seedblocksY[whichBlock] - 1 >= 22) {
            options++;
        }
        if (seedblocksY[whichBlock] + 1 <= 28) {
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0) {
                options++;
            }
        }
        if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0) {
            options++;
        }
        if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0) {
            options++;
        }
        if (options === 0) { //if no options try again
            newBlock--;
        }
        else { //spawn next seedblock
            optionChoice = Math.floor(Math.random() * options); //chooses an option
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0 && seedblocksY[whichBlock] - 1 >= 22) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock];
                    seedblocksY[newBlock] = seedblocksY[whichBlock] - 1;
                }
                optionChoice--;
            }
            if (seedblocksY[whichBlock] + 1 <= 28) {
                if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0) {
                    if (optionChoice === 0) {
                        seedblocksX[newBlock] = seedblocksX[whichBlock];
                        seedblocksY[newBlock] = seedblocksY[whichBlock] + 1;
                    }
                    optionChoice--;
                }
            }
            if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock] - 1;
                    seedblocksY[newBlock] = seedblocksY[whichBlock];
                }
                optionChoice--;
            }
            if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock] + 1;
                    seedblocksY[newBlock] = seedblocksY[whichBlock];
                }
                optionChoice--;
            }
            gameboard[seedblocksX[newBlock]][seedblocksY[newBlock]] = -1;
        }
    }
    //left
    seedblocksX = [0, 0, 0, 0];
    seedblocksY = [0, 0, 0, 0];
    whichBlock = 0;
    seedblocksX[0] = Math.floor(Math.random() * 7);
    seedblocksY[0] = Math.floor(Math.random() * (vertMax - vertMin + 1)) + vertMin;
    gameboard[seedblocksX[0]][seedblocksY[0]] = -1;
    for (var newBlock = 1; newBlock < 4; newBlock++) {
        whichBlock = Math.floor(Math.random() * newBlock);
        //consider options up down left right
        options = 0;
        if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0) {
            options++;
        }
        if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0) {
            options++;
        }
        if (seedblocksX[whichBlock] - 1 >= 0) {
            if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0) {
                options++;
            }
        }
        if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0 && seedblocksX[whichBlock] + 1 <= 6) {
            options++;
        }
        if (options === 0) { //if no options try again
            newBlock--;
        }
        else { //spawn next seedblock
            optionChoice = Math.floor(Math.random() * options); //chooses an option
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock];
                    seedblocksY[newBlock] = seedblocksY[whichBlock] - 1;
                }
                optionChoice--;
            }
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock];
                    seedblocksY[newBlock] = seedblocksY[whichBlock] + 1;
                }
                optionChoice--;
            }
            if (seedblocksX[whichBlock] - 1 >= 0) {
                if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0) {
                    if (optionChoice === 0) {
                        seedblocksX[newBlock] = seedblocksX[whichBlock] - 1;
                        seedblocksY[newBlock] = seedblocksY[whichBlock];
                    }
                    optionChoice--;
                }
            }
            if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0 && seedblocksX[whichBlock] + 1 <= 6) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock] + 1;
                    seedblocksY[newBlock] = seedblocksY[whichBlock];
                }
                optionChoice--;
            }
            gameboard[seedblocksX[newBlock]][seedblocksY[newBlock]] = -1;
        }
    }
    //right
    seedblocksX = [0, 0, 0, 0];
    seedblocksY = [0, 0, 0, 0];
    whichBlock = 0;
    seedblocksX[0] = Math.floor(Math.random() * 7) + 22;
    seedblocksY[0] = Math.floor(Math.random() * (vertMax - vertMin + 1)) + vertMin;
    gameboard[seedblocksX[0]][seedblocksY[0]] = -1;
    for (var newBlock = 1; newBlock < 4; newBlock++) {
        whichBlock = Math.floor(Math.random() * newBlock);
        //consider options up down left right
        options = 0;
        if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0) {
            options++;
        }
        if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0) {
            options++;
        }
        if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0 && seedblocksX[whichBlock] - 1 >= 22) {
            options++;
        }
        if (seedblocksX[whichBlock] + 1 <= 28) {
            if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0) {
                options++;
            }
        }
        if (options === 0) { //if no options try again
            newBlock--;
        }
        else { //spawn next seedblock
            optionChoice = Math.floor(Math.random() * options); //chooses an option
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] - 1] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock];
                    seedblocksY[newBlock] = seedblocksY[whichBlock] - 1;
                }
                optionChoice--;
            }
            if (gameboard[seedblocksX[whichBlock]][seedblocksY[whichBlock] + 1] === 0) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock];
                    seedblocksY[newBlock] = seedblocksY[whichBlock] + 1;
                }
                optionChoice--;
            }
            if (gameboard[seedblocksX[whichBlock] - 1][seedblocksY[whichBlock]] === 0 && seedblocksX[whichBlock] - 1 >= 22) {
                if (optionChoice === 0) {
                    seedblocksX[newBlock] = seedblocksX[whichBlock] - 1;
                    seedblocksY[newBlock] = seedblocksY[whichBlock];
                }
                optionChoice--;
            }
            if (seedblocksX[whichBlock] + 1 <= 28) {
                if (gameboard[seedblocksX[whichBlock] + 1][seedblocksY[whichBlock]] === 0) {
                    if (optionChoice === 0) {
                        seedblocksX[newBlock] = seedblocksX[whichBlock] + 1;
                        seedblocksY[newBlock] = seedblocksY[whichBlock];
                    }
                    optionChoice--;
                }
            }
            gameboard[seedblocksX[newBlock]][seedblocksY[newBlock]] = -1;
        }
    }
    clearForMovement = false;
}

function clearBlock(direction) {
    var x, y;
    //clear all exceept the one being moved
    if (!clearForMovement) {
        if (direction != "down") {
            for (x = 7; x < 22; x++) {
                for (y = 0; y < 7; y++) {
                    gameboard[x][y] = 0;
                }
            }
        }
        if (direction != "up") {
            for (x = 7; x < 22; x++) {
                for (y = 22; y < 29; y++) {
                    gameboard[x][y] = 0;
                }
            }
        }
        if (direction != "right") {
            for (x = 0; x < 7; x++) {
                for (y = 7; y < 22; y++) {
                    gameboard[x][y] = 0;
                }
            }
        }
        if (direction != "left") {
            for (x = 22; x < 29; x++) {
                for (y = 7; y < 22; y++) {
                    gameboard[x][y] = 0;
                }
            }
        }
        clearForMovement = true;
    }
}

function moveBlock(direction) {
    var movable = true;
    var y, x;
    if (direction == "up") {
        for (x = 0; x < 29; x++) {
            for (y = 0; y < 29; y++) {
                if (gameboard[x][y] == -1 && gameboard[x][y - 1] > 0) {
                    movable = false;
                }
            }
        }
        if (movable) {
            for (y = 0; y < 29; y++) {
                for (x = 0; x < 29; x++) {
                    if (gameboard[x][y] == -1) {
                        gameboard[x][y - 1] = gameboard[x][y];
                        gameboard[x][y] = 0;
                    }
                }
            }
        }
    }
    if (direction == "down") {
        for (x = 0; x < 29; x++) {
            for (y = 0; y < 29; y++) {
                if (gameboard[x][y] == -1 && gameboard[x][y + 1] > 0) {
                    movable = false;
                }
            }
        }
        if (movable) {
            for (y = 28; y > -1; y--) {
                for (x = 0; x < 29; x++) {
                    if (gameboard[x][y] == -1) {
                        gameboard[x][y + 1] = gameboard[x][y];
                        gameboard[x][y] = 0;
                    }
                }
            }
        }
    }
    if (direction == "left") {
        for (x = 0; x < 29; x++) {
            for (y = 0; y < 29; y++) {
                if (gameboard[x][y] == -1 && gameboard[x - 1][y] > 0) {
                    movable = false;
                }
            }
        }
        if (movable) {
            for (x = 0; x < 29; x++) {
                for (y = 0; y < 29; y++) {
                    if (gameboard[x][y] == -1) {
                        gameboard[x - 1][y] = gameboard[x][y];
                        gameboard[x][y] = 0;
                    }
                }
            }
        }
    }
    if (direction == "right") {
        for (x = 0; x < 29; x++) {
            for (y = 0; y < 29; y++) {
                if (gameboard[x][y] == -1 && gameboard[x + 1][y] > 0) {
                    movable = false;
                }
            }
        }
        if (movable) {
            for (x = 28; x > -1; x--) {
                for (y = 0; y < 29; y++) {
                    if (gameboard[x][y] == -1) {
                        gameboard[x + 1][y] = gameboard[x][y];
                        gameboard[x][y] = 0;
                    }
                }
            }
        }
    }
    if (!movable) {
        cementingBlocks();
        clearForMovement = false; //stop running this function after blocks landed
        landed = true;
    }
}

function cementingBlocks() {
    var x, y;
    for (x = 0; x < 29; x++) {
        for (y = 0; y < 29; y++) {
            if (gameboard[x][y] == -1) {
                if (Math.abs(x - 14) > Math.abs(y - 14)) {
                    if (Math.abs(x - 14) > 7) {
                        gameOver = true;
                    }
                    gameboard[x][y] = Math.abs(x - 14);
                    console.log(Math.abs(x - 14));
                }
                else {
                    if (Math.abs(y - 14) > 7) {
                        gameOver = true;
                    }
                    gameboard[x][y] = Math.abs(y - 14);
                    console.log(Math.abs(y - 14));
                }
            }
        }
    }
}

function checkClears() {
    var clearOK;
    var x, y;
    var noClears = true;
    for (var distance = 1; distance < 8; distance++) {
        clearOK = true;
        for (y = 14 - distance; y <= 14 + distance; y++) {
            if (gameboard[14 - distance][y] === 0 || gameboard[14 + distance][y] === 0) {
                clearOK = false;
                if (!clearOK) {
                    break;
                }
            }
        }
        for (x = 14 - distance; x <= 14 + distance; x++) {
            if (gameboard[x][14 - distance] === 0 || gameboard[x][14 + distance] === 0) {
                clearOK = false;
                if (!clearOK) {
                    break;
                }
            }
        }
        if (clearOK) {
            for (y = 14 - distance + 1; y < 14 + distance; y++) {
                gameboard[14 - distance][y] = 0;
                gameboard[14 + distance][y] = 0;
            }
            for (x = 14 - distance; x <= 14 + distance; x++) {
                gameboard[x][14 - distance] = 0;
                gameboard[x][14 + distance] = 0;
            }
            noClears = false;
        }

    }
    if (noClears) {
        console.log("spawning blocks");
        spawnBlocks();
        landed = false;
    }
}

function gameLoop() {
    if (!gameOver) {
        if (handleAction) { //currently working
            clearBlock(moveDirection);
            handleAction = false;
        }
        if (clearForMovement) { //excess blocks removed, ready to drop
            moveBlock(moveDirection); //drop blocks 1 at a time
        }
        if (landed) {
            console.log("whatIsHappening");
            checkClears();
            console.log("Out of checkClears()");
        }
        drawGame();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = lineSize;
    ctx.miterLimit = 0;
    for (var yLine = 0; yLine <= gameboard[0].length; yLine++) {
        ctx.beginPath();
        ctx.moveTo(0, (boxSize + lineSize) * yLine + lineSize / 2);
        ctx.lineTo(gameWidth, (boxSize + lineSize) * yLine + lineSize / 2);
        ctx.stroke();
    }
    for (var xLine = 0; xLine <= gameboard.length; xLine++) {
        ctx.beginPath();
        ctx.moveTo((boxSize + lineSize) * xLine + lineSize / 2, 0);
        ctx.lineTo((boxSize + lineSize) * xLine + lineSize / 2, gameHeight);
        ctx.stroke();
    }
    for (var y = 0; y < 29; y++) {
        for (var x = 0; x < 29; x++) {
            switch (gameboard[x][y]) { //LUXURIOUS AND GLORIOUS SEVEN-COLOR BARRAGE
                case -1:
                    ctx.fillStyle = "#444444";
                    break;
                case 0:
                    ctx.fillStyle = "#ffffff";
                    break;
                case 1:
                    ctx.fillStyle = "red";
                    break;
                case 2:
                    ctx.fillStyle = "orange";
                    break;
                case 3:
                    ctx.fillStyle = "yellow";
                    break;
                case 4:
                    ctx.fillStyle = "green";
                    break;
                case 5:
                    ctx.fillStyle = "blue";
                    break;
                case 6:
                    ctx.fillStyle = "indigo";
                    break;
                case 7:
                    ctx.fillStyle = "violet";
                    break;
                case 8:
                    ctx.fillStyle = "#888888";
                    break;
                case 9:
                    ctx.fillStyle = "#bbbbbb";
                    break;
                default:
                    ctx.fillStyle = "#bbbbbb";
            }
            ctx.fillRect((boxSize + lineSize) * x + lineSize, (boxSize + lineSize) * y + lineSize, boxSize, boxSize);
            //LATER ADDITION: draw boxes
        }
    }
}