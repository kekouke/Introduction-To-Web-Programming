class Gun {
    constructor(uselessnumber) {
        this.color = 'rgb('+Math.floor(Math.random()*256)+','
        +Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';     
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(900, 900, 30, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

var canvas,
    ctx,
    idTimer,
    player,
    score = 0,
    username = 'kekouke',
    level = 1,
    health = 100;

function init() {

    canvas = document.createElement("canvas");

    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        canvas.width = 1478;
        canvas.height = 600;
        document.body.appendChild(canvas);

        //username = prompt("Print your name here:"); //TODO
        player = new Gun(1);
        Draw(ctx, canvas.width, canvas.height);
        //startGame();

       /* document.getElementById('speedValue').addEventListener('change', function(e) {
            speed = +document.getElementById('speedValue').value;
        });

        document.getElementById('sizeValue').addEventListener('change', function(e) {
            maxFigureSize = document.getElementById('sizeValue').value;
        });
        */
    }
}

function Draw(ctx, w, h) {

    ctx.save();
    var image = new Image();

    image.onload = function() {
        ctx.drawImage(image, 0, 0, w, h);
        drawScore(ctx);
        drawHealth(ctx);
        drawUsername(ctx);
        drawLevel(ctx);
        player.draw(ctx);
    };

    image.src = "./img/background.jpg";

    ctx.restore();
}

// Реализовать функцию drawInterface
function drawScore(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#212121";
    ctx.fillText("Score: " + score, 20, 40);
}

function drawHealth(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#212121";
    ctx.fillText("Health: " + health, 1300, 40);
}

function drawUsername(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#212121";
    ctx.fillText(username, 20, 580);
}
function drawLevel(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#212121";
    ctx.fillText("Level: " + level, 1350, 580);
}
//

function startGame() {
    clearInterval(idTimer);
    idTimer = setInterval(main, 1000);
}

function main() {
    Draw(ctx, canvas.width, canvas.height);
    score++;
}
/*     <input type="button" value="GO!" onclick="startGame()"> */