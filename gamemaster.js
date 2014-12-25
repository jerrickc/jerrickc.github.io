//Please wait warmly, document is preparing...
var sizeButton = document.createElement("button");
var canvas = document.createElement("canvas");
canvas.id = "gamescreen";
sizeButton.id = "resizeButton";
sizeButton.innerHTML = "Resize the game";
document.body.appendChild(sizeButton);
$("#resizeButton").bind("mousedown", function() {
    resize();
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(canvas);
//Document prep done by here, code below is the game
var ctx = canvas.getContext("2d");
var gameboard = makeBoard();
var boxSize = 50;
var gameWidth = $(canvas).width();
var gameHeight = $(canvas).height();
theBigLoop = setInterval(function() {
    gameLoop();
}, 250);
//Game functions below
function makeBoard() { //Javascript doesn't make 2D arrays with [][] so I put some arrays in my arrays

    var newBoard = new Array(29); //DIFFICULTY SLIDER: the board is 29x29 right now, might shrink it to 27x27
    for (var i = 0; i < 29; i++) {
        newBoard[i] = new Array(29);
    }
    newBoard[15][15] = -1;
    return newBoard;
}

function resize() { //Leeet us zee if zis vurkz

    var newSize = prompt("Enter desired box size in pixels");
    boxSize = parseInt(newSize);
    //LATER ADDITION: resize the canvas and stuff
    drawGame();
}

function spinBoard(direction) { //LATER ADDITION: add rotatecounter //DIFFICULTY SLIDER: allow 2 rotations instead of 1

    if (direction == "right") { //rotate right 90 degrees


    }
    else if (direction == "left") { //rotate left 90 degrees


    }
}

function gameLoop() {
    console.log("looping");
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    ctx.strokeStyle = "#000";
    ctx.miterLimit = 1;
    for (var yLine = 0; yLine < 29; yLine++) {
        if (yLine === 0) {
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(0, (boxSize + 2) * yLine + 1);
        ctx.lineTo(gameWidth, (boxSize + 2) * yLine + 1);
        ctx.stroke();
        if (yLine === 0) {
            ctx.lineWidth = 1;
        }
    }
    for (var xLine = 0; xLine < 29; xLine++) {
        if (xLine === 0) {
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo((boxSize + 2) * xLine + 1, 0);
        ctx.lineTo((boxSize + 2) * xLine + 1, gameHeight);
        ctx.stroke();
        if (xLine === 0) {
            ctx.lineWidth = 1;
        }
    }
    //LATER ADDITION: draw boxes
}