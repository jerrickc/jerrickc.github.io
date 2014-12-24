var canvas = document.createElement("canvas");
canvas.setAttribute("id", "gamescreen");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
ctx.fillStyle = "green";
ctx.fillRect(0,0,100,100);