class Gun {
    constructor() {
        this.posX = 40;
        this.posY = 470;
        this.angle = 0;
    }

    draw() {
        let [x, y] = [this.posX, this.posY];
        ctx.fillStyle = "#CA3767";
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, 30, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "#212121";
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x - 5, y - 40);
        ctx.lineTo(x + 10, y - 40);
        ctx.lineTo(x + 10, y);
        ctx.fill();
        ctx.closePath();
    }

    rotate() {
        ctx.translate(this.posX, this.posY);
        ctx.rotate(Math.PI / 2 - this.angle);
        ctx.translate(-this.posX, -this.posY);
    }
}

class Bullet {
    constructor(x, y, angle) {
        this.posX = x;
        this.posY = y;
        this.angle = angle;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, 7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();

        this.posX += 5;
        this.posY -= 5;
    }

}

var backbround,
    canvas,
    ctx,
    idTimer,
    player,
    score = 0,
    username = 'kekouke',
    level = 1,
    health = 100,
    mouseX,
    mouseY,
    bullet;

function init() {

    canvas = document.createElement("canvas");

    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        canvas.width = 1478;
        canvas.height = 600;
        document.body.appendChild(canvas);

        document.addEventListener("mousemove", function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            dx = Math.abs(mouseX - player.posX);
            dy = Math.abs(mouseY - player.posY);
            player.angle = Math.atan(dy/ dx);
        });

        document.addEventListener("keydown", function(e) {
            if (e.key == "ArrowRight") {
                player.posX += 15;
            } else if (e.key == "ArrowLeft") {
                player.posX -= 15;
                bullet = null;
            }
        });

        document.addEventListener("click", bulletGo, false);

        player = new Gun();
        loadPicture();

        //username = prompt("Print your name here:"); //TODO
        //Draw(ctx, canvas.width, canvas.height);

       /* document.getElementById('speedValue').addEventListener('change', function(e) {
            speed = +document.getElementById('speedValue').value;
        });

        document.getElementById('sizeValue').addEventListener('change', function(e) {
            maxFigureSize = document.getElementById('sizeValue').value;
        });
        */
    }
}

function loadPicture() {

    background = new Image();

    background.onload = function() {
        Draw(ctx, canvas.width, canvas.height);        
    };

    background.src = "./img/background.jpg";
}

function Draw(ctx, w, h) {
    ctx.save();
    ctx.drawImage(background, 0, 0, w, h);
    drawInterface(ctx);
    player.rotate();
    player.draw(ctx);
    ctx.restore();
}

function drawInterface(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#212121";
    ctx.fillText("Score: " + score, 20,  40);
    ctx.fillText("Health: " + health, 1300, 40);
    ctx.fillText(username, 20, 580);
    ctx.fillText("Level: " + level, 1350, 580);
}

function startGame() {
    clearInterval(idTimer);
    idTimer = setInterval(main, 50);
}

function main() {
    Draw(ctx, canvas.width, canvas.height);
    score++;
    
    if (bullet != null) {
        bullet.draw();
    }

}

function bulletGo() {
    bullet = new Bullet(player.posX, player.posY, player.angle);
}
