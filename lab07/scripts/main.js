//sprites
var blue_bird = new Image(100, 100);
blue_bird.src = './blue_bird.png';
var jelly_monster = new Image(100, 100);
jelly_monster.src = './jelly_monster.png';
var flying_ball = new Image(100, 100);
flying_ball.src = './flying_ball.png';
var reload_indicator = new Image(70, 50);
reload_indicator.src = './bulletreload.png';

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

    move() {
        if (rightPressed) {
            player.posX += 10;
        }
        if (leftPressed) {
            player.posX -= 10;
        }
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
        this.speed = 30;
    }

    move() {
        this.posX += (Math.cos(this.angle  - Math.PI / 2)) * this.speed;
        this.posY += (Math.sin(this.angle  - Math.PI / 2)) * this.speed;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, 7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
}

class Enemy {
    constructor(x, y, size, speed, pts, sprite) {
        this.posX = x;
        this.posY = y;
        this.size = size;
        this.speed = speed;
        this.points = pts;
        this.sprite = sprite;
    }

    move() {
        this.posX -= this.speed;
        this.posY += Math.floor(Math.random() * 5) - 2;

    }

    draw() {
        ctx.drawImage(this.sprite, this.posX, this.posY, this.size, this.size);
    }

    getPoints() {
        let [x, y, size] = [this.posX, this.posY, this.size];

        return [
            [x, y],
            [x + size, y],
            [x + size, y + size],
            [x, y + size]
        ];

    }
}

var player; 

//canvas
var backbround,
    canvas,
    ctx; 

//systemVariables
var idTimer,
    rTimer,
    mouseX,
    mouseY,
    rightPressed = false,
    leftPressed = false,
    reload = 9,
    enemiesOnLvl = 5,
    isRunGame;

//gameParam
var username = '',
    score = 0;
    level = 1;
    health = 100;

//gameObject
var bullets,
    enemies;



enemy_data = [
    {
        size: 100,
        speed: 10 * level,
        points: 5,
        sprite: blue_bird
    },
    {
        size: 100,
        speed: 5 * level,
        points: 10,
        sprite: jelly_monster
    },
    {
        size: 70,
        speed: 20 * level,
        points: 50,
        sprite: flying_ball
    }
];

function init() {

    if (canvas != undefined) {
        canvas.remove();
    }

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
            if (e.key.toLowerCase() == "d" || e.key.toLowerCase() == "в") {
                rightPressed = true;
            } else if (e.key.toLowerCase() == "a" || e.key.toLowerCase() == "ф") {
                leftPressed = true;
            }
        });

        document.addEventListener("keyup", function(e) {
            if (e.key.toLowerCase() == "d" || e.key.toLowerCase() == "в") {
                rightPressed = false;
            } else if (e.key.toLowerCase() == "a" || e.key.toLowerCase() == "ф") {
                leftPressed = false;
            }
        });

        canvas.addEventListener("click", function(e) {
            if (isRunGame) {
                if (reload >= 10) {
                    reload = 0;
                    bullets.push(new Bullet(player.posX, player.posY, player.angle));
                } 
            }
        }, false);

        player = new Gun();

        score = 0;
        level = 1;
        health = 100;
        bullets = [];
        enemies = [];

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

    player.move();
    player.rotate();
    player.draw(ctx);
    ctx.restore();

    if (reload >= 9) {
        ctx.drawImage(reload_indicator, 0, 540, 70, 50);
    }

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
        bullets[i].move();
        destroyBullet(i); // TODO: Сделать проверку на уничтожение пульки и не увеличивать i, если пуля взорвалась
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        enemies[i].move();
        if (killEnemy(i)) {
            i--;
            health -= 25;
        }
    }
    drawInterface(ctx);
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
    //inputName();
    isRunGame = true;
    clearInterval(idTimer);
    idTimer = setInterval(main, 50);
    getRandomEnemy();
}

function main() {
    if (health != 110) {

        Draw(ctx, canvas.width, canvas.height);
        reload++;

        while (enemies.length < enemiesOnLvl) {
            getRandomEnemy();
        }
    
        detectCollision(); //TODO: Rename
    
        level = Math.round(score / 500) + 1;
        enemiesOnLvl = 5 * level;
    } else {
        health = 0;
        Draw(ctx, canvas.width, canvas.height);
        clearInterval(idTimer);
        alert("GAME OVER!!!");
        gameOver();
    }
}

function detectCollision() {
    for (let i = 0; i < bullets.length; i++) {

        let bullet = bullets[i];

        for (let j = 0; j < enemies.length; j++) {

            let enemy = enemies[j];

            if (pointInPoly(enemy, bullet.posX, bullet.posY)) {
                score += enemy.points;
                enemies.splice(j, 1);
            }
        }
    }
}

function destroyBullet(index) {
    if (bullets[index].posX > canvas.width || bullets[index].posY > canvas.height ||
        bullets[index].posX < 0 || bullets[index].posY < 0) {
            bullets.splice(index, 1);
        }
}

function killEnemy(index) {
    if (enemies[index].posY > canvas.height || enemies[index].posX < 0 || enemies[index].posY < 0) {
            enemies.splice(index, 1);
            return true;
    }
    return false;
}

function setName() {
    let name = prompt("Type your name, please: ");

    if (Boolean(name)) {
        username = name;
    }
    else {
        inputName();
    }
}

function getRandomEnemy() {
    let enemy = enemy_data[Math.floor(Math.random() * 3)];

    let x = canvas.width + randomInteger(200, 1000);
    let y = randomInteger(0, 500);

    enemies.push(new Enemy(x, y, enemy.size, enemy.speed, enemy.points, enemy.sprite));
}

function randomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

function pointInPoly(object, pointX, pointY)
{
    let destroy = 0;
    let points = object.getPoints();

	for (let i = 0, j = points.length - 1; i < points.length; j = i++)
	{
        if (((points[i][1] > pointY) != (points[j][1] > pointY)) && 
        (pointX < (points[j][0] - points[i][0]) * (pointY - points[i][1]) / 
        (points[j][1] - points[i][1]) + points[i][0]))
		{
            destroy = !destroy;
		}
 
	}
 
	return destroy;
}

function pause() {
    isRunGame = false;
    clearInterval(idTimer);
}

function gameOver() {
    localStorage.setItem(username, score);
    canvas.style.display = "none";
    changeDisplay();
    //displayLiderboard();
}

function new_game() {
    //setName();
    init();
}

function changeDisplay() {
    if (isRunGame) {
        pause();
        canvas.style.display = "none";
        displayLiderboard();
    } else {
        let table = document.getElementById("table");
        table.firstChild.remove();
        canvas.style.display = "block";
    }
}

function displayLiderboard() {
    let html = "<table><th>ИМЯ</th><th>ОЧКИ</th>";
    for (let i = 0; i < localStorage.length && i < 15; i++) {
        html += "<tr aling=\"center\">";
        for (let j = 0; j < 1; j++) {
            let key = localStorage.key(i);
            html += "<td>" + localStorage.key(i) + "</td>";
            html += "<td>" + localStorage.getItem(key) + "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";

    document.getElementById("table").innerHTML = html;
}