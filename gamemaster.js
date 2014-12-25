//Please wait warmly, document is preparing...
var boxSize = 15;
var sizeButton = document.createElement("button");
var canvas = document.createElement("canvas");
canvas.id = "gamescreen";
canvas.height = (boxSize + 1) * 29 + 1;
canvas.width = (boxSize + 1) * 29 + 1;
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
    newBoard[14][14] = -1;
    return newBoard;
}

function resize() { //Leeet us zee if zis vurkz

    var newSize = prompt("Enter desired box size in pixels");
    boxSize = parseInt(newSize);
    gameWidth = (boxSize + 1) * 29 + 1; //gotta be large enough for 1 more line at the end of the squares + lines
    gameHeight = gameWidth;
    canvas.height = gameHeight;
    canvas.width = gameWidth;
    drawGame();
}

function spinBoard(direction) { //LATER ADDITION: add rotatecounter //DIFFICULTY SLIDER: allow 2 rotations instead of 1

    if (direction == "right") { //rotate right 90 degrees


    }
    else if (direction == "left") { //rotate left 90 degrees


    }
}

function gameLoop() {
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    ctx.strokeStyle = "#000000";
    ctx.miterLimit = 1;
    for (var yLine = 0; yLine <= 29; yLine++) {
        ctx.beginPath();
        ctx.moveTo(0, (boxSize + 1) * yLine + 1);
        ctx.lineTo(gameWidth, (boxSize + 1) * yLine + 1);
        ctx.stroke();
    }
    for (var xLine = 0; xLine <= 29; xLine++) {
        ctx.beginPath();
        ctx.moveTo((boxSize + 1) * xLine + 1, 0);
        ctx.lineTo((boxSize + 1) * xLine + 1, gameHeight);
        ctx.stroke();
    }
    for (var y = 0; y < 29; y++) {
        for (var x = 0; x < 29; x++) {
            switch (gameboard[x][y]) { //LUXURIOUS AND GLORIOUS SEVEN-COLOR BARRAGE
                    case -1:
                        ctx.fillStyle = "#bbbbbb";
                        break;
                    case 0:
                        ctx.fillStyle = "#ffffff";
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                    case 7:
                        break;
                    case 8:
                        break;
                    case 9:
                        break;
                    default:
                    ctx.fillStyle = "#ffffff";
                }
                ctx.fillRect((boxSize + 1) * x + 1, (boxSize + 1) * y + 1, boxSize, boxSize);
                //LATER ADDITION: draw boxes
        }
    }
}