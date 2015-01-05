//Please wait warmly, document is preparing...
var boxSize = 14;
var lineSize = 2;
var sizeButton = document.createElement("button");
var canvas = document.createElement("canvas");
var scoreBlock = document.createElement("h4");
var resetButton = document.createElement("button");
var speedButton = document.createElement("button");
var link = document.createElement("a");
link.id = "gameSource";
link.href = "https://github.com/jerrickc/jerrickc.github.io/";
link.innerHTML = "Click here to view my source!"
speedButton.id = "speedChanger";
speedButton.innerHTML = "Change speed(ms)";
resetButton.id = "resetter";
resetButton.innerHTML = "Restart the game";
scoreBlock.id = "displayHeader";
canvas.id = "gamescreen";
canvas.height = (boxSize + lineSize) * 29 + lineSize;
canvas.width = (boxSize + lineSize) * 29 + lineSize;
sizeButton.id = "resizeButton";
sizeButton.innerHTML = "Resize the game";
document.body.appendChild(scoreBlock);
document.body.appendChild(canvas);
document.getElementById("gamescreen").style = "display: block; margin: 0 auto;";
$("*").on("keyup", function(event) {
    handleIt(event);
    event.stopPropagation();
});
document.body.appendChild(sizeButton);
$("#resizeButton").on("mousedown", function() {
    resize();
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(speedButton); //Time Control!
$("#speedChanger").on("mousedown", function() {
    changeSpeed();
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(resetButton); //Chronoshiftin
$("#resetter").on("mousedown", function() {
    restartGame();
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(link);
window.addEventListener("keydown", function(e) {
    // no scrolling by arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
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
var score = 0;
spawnBlocks();
var theBigLoop = setInterval(function() {
    gameLoop();
}, 100);
//Game functions below
function changeSpeed() {
    var newSpeed = prompt("Enter desired refresh speed in ms(default 100)");
    clearInterval(theBigLoop);
    if(newSpeed < 10){
        newSpeed = 10;
    }
    theBigLoop = setInterval(function() {
        gameLoop();
    }, newSpeed);
}
function restartGame() {
    console.log("attempting to restart");
    gameboard = makeBoard();
    gameWidth = $(canvas).width();
    gameHeight = $(canvas).height();
    handleAction = false;
    landed = false;
    clearForMovement = false;
    moveDirection = null;
    gameOver = false;
    score = 0;
    spawnBlocks();
    theBigLoop = setInterval(function() {
        gameLoop();
    }, 100);
}

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

function handleIt(event) { //Raid Leader
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
            case 90: //90 is z
                spinBoard("left");
                break;
            case 88: //88 is x
                spinBoard("right");
                break;
        }
    }
}

function resize() { //Leeet us zee if zis vurkz
    var newSize = prompt("Enter desired box size in pixels(default 14)");
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
    var newBoard = new Array(29); //DIFFICULTY SLIDER: the board is 29x29 right now, might shrink it to 27x27
    var x, y;
    var distX, distY;
    for (var i = 0; i < 29; i++) {
        newBoard[i] = new Array(29);
    }
    for (x = 0; x < 29; x++) { //bodyblocking setup
        for (y = 0; y < 29; y++) {
            if (x < 7 || x > 21 || y < 7 || y > 21) {
                newBoard[x][y] = gameboard[x][y];
            }
        }
    }
    newBoard[14][14] = 8;
    if (direction === "right") { //rotate right 90 degrees
        for (x = 7; x < 22; x++) {
            for (y = 7; y < 22; y++) {
                newBoard[x][y] = 0;
                distX = x - 14;
                distY = y - 14;
                newBoard[x][y] = gameboard[14 + distY][14 - distX];
            }
        }
    }
    else if (direction === "left") { //rotate left 90 degrees
        for (x = 7; x < 22; x++) {
            for (y = 7; y < 22; y++) {
                newBoard[x][y] = 0;
                distX = x - 14;
                distY = y - 14;
                newBoard[x][y] = gameboard[14 - distY][14 + distX];
            }
        }
    }
    gameboard = newBoard;
    //check that blocks will still collide
    var VMin = 28,
        VMax = 0,
        HMin = 28,
        HMax = 0;
    var SpawnMin, SpawnMax;
    for (x = 7; x < 22; x++) { //find max/min of the center playspace
        for (y = 7; y < 22; y++) {
            if (gameboard[x][y] > 0) {
                if (HMax < x) {
                    HMax = x;
                }
                if (HMin > x) {
                    HMin = x;
                }
                if (VMax < y) {
                    VMax = y;
                }
                if (VMin > y) {
                    VMin = y;
                }
            }
        }
    }
    //check top
    SpawnMax = 0;
    SpawnMin = 28;
    for (x = 7; x < 22; x++) {
        for (y = 0; y < 7; y++) {
            if (gameboard[x][y] == -1) {
                if (SpawnMax < x) {
                    SpawnMax = x;
                }
                if (SpawnMin > x) {
                    SpawnMin = x;
                }
            }
        }
    }
    while (SpawnMax < HMin) { //if needs to be moved to the right
        for (x = 21; x > 7; x--) {
            for (y = 0; y < 7; y++) {
                gameboard[x][y] = gameboard[x - 1][y];
                gameboard[x - 1][y] = 0;
            }
        }
        SpawnMax++;
        SpawnMin++;
    }
    while (SpawnMin > HMax) { //if needs to be moved to the left
        for (x = 7; x < 21; x++) {
            for (y = 0; y < 7; y++) {
                gameboard[x][y] = gameboard[x + 1][y];
                gameboard[x + 1][y] = 0;
            }
        }
        SpawnMin--;
        SpawnMax--;
    }
    //check bottom
    SpawnMax = 0;
    SpawnMin = 28;
    for (x = 7; x < 22; x++) {
        for (y = 22; y < 29; y++) {
            if (gameboard[x][y] == -1) {
                if (SpawnMax < x) {
                    SpawnMax = x;
                }
                if (SpawnMin > x) {
                    SpawnMin = x;
                }
            }
        }
    }
    while (SpawnMax < HMin) { //if needs to be moved to the right
        for (x = 21; x > 7; x--) {
            for (y = 22; y < 29; y++) {
                gameboard[x][y] = gameboard[x - 1][y];
                gameboard[x - 1][y] = 0;
            }
        }
        SpawnMax++;
        SpawnMin++;
    }
    while (SpawnMin > HMax) { //if needs to be moved to the left
        for (x = 7; x < 21; x++) {
            for (y = 22; y < 29; y++) {
                gameboard[x][y] = gameboard[x + 1][y];
                gameboard[x + 1][y] = 0;
            }
        }
        SpawnMin--;
        SpawnMax--;
    }
    //check left
    SpawnMax = 0;
    SpawnMin = 28;
    for (x = 0; x < 7; x++) {
        for (y = 7; y < 22; y++) {
            if (gameboard[x][y] == -1) {
                if (SpawnMax < y) {
                    SpawnMax = y;
                }
                if (SpawnMin > y) {
                    SpawnMin = y;
                }
            }
        }
    }
    while (SpawnMax < VMin) { //if needs to be moved down
        for (y = 21; y > 7; y--) {
            for (x = 0; x < 7; x++) {
                gameboard[x][y] = gameboard[x][y - 1];
                gameboard[x][y - 1] = 0;
            }
        }
        SpawnMax++;
        SpawnMin++;
    }
    while (SpawnMin > VMax) { //if needs to be moved up
        for (y = 7; y < 21; y++) {
            for (x = 0; x < 7; x++) {
                gameboard[x][y] = gameboard[x][y + 1];
                gameboard[x][y + 1] = 0;
            }
        }
        SpawnMin--;
        SpawnMax--;
    }
    //check right
    SpawnMax = 0;
    SpawnMin = 28;
    for (x = 22; x < 29; x++) {
        for (y = 7; y < 22; y++) {
            if (gameboard[x][y] == -1) {
                if (SpawnMax < y) {
                    SpawnMax = y;
                }
                if (SpawnMin > y) {
                    SpawnMin = y;
                }
            }
        }
    }
    while (SpawnMax < VMin) { //if needs to be moved down
        for (y = 21; y > 7; y--) {
            for (x = 22; x < 29; x++) {
                gameboard[x][y] = gameboard[x][y - 1];
                gameboard[x][y - 1] = 0;
            }
        }
        SpawnMax++;
        SpawnMin++;
    }
    while (SpawnMin > VMax) { //if needs to be moved up
        for (y = 7; y < 21; y++) {
            for (x = 22; x < 29; x++) {
                gameboard[x][y] = gameboard[x][y + 1];
                gameboard[x][y + 1] = 0;
            }
        }
        SpawnMin--;
        SpawnMax--;
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
            if (gameboard[x][y] == -1 || (gameboard[x][y] > 0 && gameboard[x][y] < 8)) {
                if (Math.abs(x - 14) > Math.abs(y - 14)) {
                    if (Math.abs(x - 14) > 7) {
                        gameOver = true;
                    }
                    gameboard[x][y] = Math.abs(x - 14);
                }
                else {
                    if (Math.abs(y - 14) > 7) {
                        gameOver = true;
                    }
                    gameboard[x][y] = Math.abs(y - 14);
                }
            }
        }
    }
}

function checkClears() {
    var clearOK;
    var x, y;
    var noClears = true;
    var allClear = false;
    for (var distance = 1; distance < 8; distance++) { //check rings of distance length away
        clearOK = true;
        for (y = 14 - distance; y <= 14 + distance; y++) { //scan left/right columns
            if (gameboard[14 - distance][y] === 0 || gameboard[14 + distance][y] === 0) {
                clearOK = false;
                if (!clearOK) {
                    break;
                }
            }
        }
        for (x = 14 - distance; x <= 14 + distance; x++) { //scan top/bot rows
            if (gameboard[x][14 - distance] === 0 || gameboard[x][14 + distance] === 0) {
                clearOK = false;
                if (!clearOK) {
                    break;
                }
            }
        }
        if (clearOK || allClear) { //falling lines/remove blocks
            noClears = false;
            allClear = true;
            if (distance == 7) {
                for (y = 14 - distance; y <= 14 + distance; y++) { //left/right columns
                    gameboard[14 - distance][y] = 0;
                    gameboard[14 + distance][y] = 0;
                }
                for (x = 14 - distance; x <= 14 + distance; x++) { //top/bot rows
                    gameboard[x][14 - distance] = 0;
                    gameboard[x][14 + distance] = 0;
                }
            }
            else {
                for (y = 14 - distance + 1; y < 14 + distance; y++) { //left/right columns
                    gameboard[14 - distance][y] = gameboard[14 - distance - 1][y];
                    gameboard[14 + distance][y] = gameboard[14 + distance + 1][y];
                }
                for (x = 14 - distance + 1; x < 14 + distance; x++) { //top/bot rows
                    gameboard[x][14 - distance] = gameboard[x][14 - distance - 1];
                    gameboard[x][14 + distance] = gameboard[x][14 + distance + 1];
                }
                //drop corners
                var cornerAdjacencies;
                //check topleft
                cornerAdjacencies = 0;
                if (gameboard[14 - distance - 1][14 - distance - 1] > 0 && gameboard[14 - distance - 1][14 - distance - 1] < 8) { //checks diagonal
                    cornerAdjacencies++;
                }
                if (gameboard[14 - distance][14 - distance - 1] > 0 && gameboard[14 - distance][14 - distance - 1] < 8) { //checks above
                    cornerAdjacencies++;
                }
                if (gameboard[14 - distance - 1][14 - distance] > 0 && gameboard[14 - distance - 1][14 - distance] < 8) { //checks left
                    cornerAdjacencies++;
                }
                if (cornerAdjacencies >= 2) {
                    gameboard[14 - distance][14 - distance] = 1;
                }
                else {
                    gameboard[14 - distance][14 - distance] = 0;
                }
                //check topright
                cornerAdjacencies = 0;
                if (gameboard[14 + distance + 1][14 - distance - 1] > 0 && gameboard[14 + distance + 1][14 - distance - 1] < 8) { //checks diagonal
                    cornerAdjacencies++;
                }
                if (gameboard[14 + distance][14 - distance - 1] > 0 && gameboard[14 + distance][14 - distance - 1] < 8) { //checks above
                    cornerAdjacencies++;
                }
                if (gameboard[14 + distance + 1][14 - distance] > 0 && gameboard[14 + distance + 1][14 - distance] < 8) { //checks right
                    cornerAdjacencies++;
                }
                if (cornerAdjacencies >= 2) {
                    gameboard[14 + distance][14 - distance] = 1;
                }
                else {
                    gameboard[14 + distance][14 - distance] = 0;
                }
                //check botright
                cornerAdjacencies = 0;
                if (gameboard[14 + distance + 1][14 + distance + 1] > 0 && gameboard[14 + distance + 1][14 + distance + 1] < 8) { //checks diagonal
                    cornerAdjacencies++;
                }
                if (gameboard[14 + distance][14 + distance + 1] > 0 && gameboard[14 + distance][14 + distance + 1] < 8) { //checks below
                    cornerAdjacencies++;
                }
                if (gameboard[14 + distance + 1][14 + distance] > 0 && gameboard[14 + distance + 1][14 + distance] < 8) { //checks right
                    cornerAdjacencies++;
                }
                if (cornerAdjacencies >= 2) {
                    gameboard[14 + distance][14 + distance] = 1;
                }
                else {
                    gameboard[14 + distance][14 + distance] = 0;
                }
                //check botleft
                cornerAdjacencies = 0;
                if (gameboard[14 - distance - 1][14 + distance + 1] > 0 && gameboard[14 - distance - 1][14 + distance + 1] < 8) { //checks diagonal
                    cornerAdjacencies++;
                }
                if (gameboard[14 - distance][14 + distance + 1] > 0 && gameboard[14 - distance][14 + distance + 1] < 8) { //checks below
                    cornerAdjacencies++;
                }
                if (gameboard[14 - distance - 1][14 + distance] > 0 && gameboard[14 - distance - 1][14 + distance] < 8) { //checks left
                    cornerAdjacencies++;
                }
                if (cornerAdjacencies >= 2) {
                    gameboard[14 - distance][14 + distance] = 1;
                }
                else {
                    gameboard[14 - distance][14 + distance] = 0;
                }
            }
        }
    }
    cementingBlocks();
    if (noClears) {
        score += 50;
        spawnBlocks();
        landed = false;
    }
    else {
        score += 1000;
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
            checkClears();
        }
        drawGame();
        updateScore();
    }
    else {
        clearInterval(theBigLoop);
    }
}

function updateScore() {
    if (!gameOver) {
        document.getElementById("displayHeader").innerHTML = "Score: " + score + " pts";
    }
    else {
        document.getElementById("displayHeader").innerHTML = "Game Over: " + score + " pts";
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
                    ctx.fillStyle = "#DDDDDD";
                    break;
                default:
                    ctx.fillStyle = "#bbbbbb";
            }
            ctx.fillRect((boxSize + lineSize) * x + lineSize, (boxSize + lineSize) * y + lineSize, boxSize, boxSize);
        }
    }
}
