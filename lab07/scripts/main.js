class Gun {
    constructor() {
        this.posX = 40;
        this.posY = 470;
        this.angle = 0;
    }

    draw() {
        let [x, y] = [this.posX, this.posY];

        ctx.fillStyle = "#212121";
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x - 5, y - 60);
        ctx.lineTo(x + 10, y - 60);
        ctx.lineTo(x + 10, y);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "#CA3767";
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, 30, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }

    rotate() {
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle);
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

        this.posX += 50;
        this.posY -= 50;
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
    bullet,
    targetAngle,
    rightPressed = false,
    leftPressed = false;

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

            dx = mouseX - player.posX;
            dy = mouseY - player.posY;
            player.angle = Math.atan2(dy, dx) + Math.PI / 2;
        }, false);

        document.addEventListener("keydown", function(e) {
            if (e.key == "ArrowRight") {
                rightPressed = true;
            } else if (e.key == "ArrowLeft") {
                leftPressed = true;
            }
        });

        document.addEventListener("keyup", function(e) {
            if (e.key == "ArrowRight") {
                rightPressed = false;
            } else if (e.key == "ArrowLeft") {
                leftPressed = false;
            }
        });

        document.addEventListener("click", bulletGo, false);

        player = new Gun();
        loadPicture();
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, w, h);
    drawInterface(ctx);

    if (rightPressed) {
        player.posX += 10;
    }
    if (leftPressed) {
        player.posX -= 10;
    }

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
