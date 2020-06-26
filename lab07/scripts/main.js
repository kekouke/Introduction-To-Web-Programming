//sprites
var blue_bird = new Image(100, 100);
blue_bird.src = './blue_bird.png';
var jelly_monster = new Image(100, 100);
jelly_monster.src = './jelly_monster.png';
var flying_ball = new Image(100, 100);
flying_ball.src = './flying_ball.png';
var reload_indicator = new Image(70, 50);
reload_indicator.src = './bulletreload.png';

var background = new Image();
background.src = "./img/background.jpg";

var player; 

//canvas
var canvas,
    ctx; 

//systemVariables
var idTimer,
    rTimer,
    mouseX,
    mouseY,
    rightPressed = false,
    leftPressed = false,
    reloadTimer = 9,
    enemiesOnLvl = 5,
    isGameDisplay,
    pauseFlag;

//gameParam
var username = '',
    score = 0;
    level = 1;
    health = 100;

//gameObject
var bullets,
    enemies,
    liderboard;



enemy_data = [
    {
        size: 100,
        speed: 7 * level,
        points: 30,
        sprite: blue_bird,
        damage: 25
    },
    {
        size: 100,
        speed: 5 * level,
        points: 20,
        sprite: jelly_monster,
        damage: 10
    },
    {
        size: 70,
        speed: 8 * level,
        points: 100,
        sprite: flying_ball,
        damage: 1
    }
];

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
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x + 60, y + 5);
        ctx.lineTo(x + 60, y - 20);
        ctx.lineTo(x, y - 10);
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
        this.speed = 40;

        if (mouseX > this.posX) {
            this.direction = 1;
        }
        else {
            this.direction = -1;
        }

    }

    move() {
        this.posX += (Math.cos(this.angle)) * this.speed;
        this.posY += (Math.sin(this.angle)) * this.speed;
        this.angle += 2 * Math.PI / 180 * this.direction;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, 15, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
}

class Enemy {
    constructor(x, y, size, speed, pts, sprite, damage) {
        this.posX = x;
        this.posY = y;
        this.size = size;
        this.speed = speed;
        this.points = pts;
        this.sprite = sprite;
        this.damage = damage;
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

function init() {

    canvas = document.createElement("canvas");

    player = new Gun();

    score = 0;
    level = 1;
    health = 100;
    bullets = [];
    enemies = [];
    liderboard = [];
    isGameDisplay = true;

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
            player.angle = (Math.atan2(dy, dx));

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
            if (!pauseFlag) {
                if (reloadTimer >= 10) {
                    reloadTimer = 0;
                    bullets.push(new Bullet(player.posX, player.posY, player.angle));
                } 
            }
        }, false);

        Draw(ctx, canvas.width, canvas.height);
    }
}

function Draw(ctx, w, h) {
    ctx.save();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, w, h);

    player.move();
    player.rotate();
    player.draw(ctx);
    ctx.restore();

    if (reloadTimer >= 9) {
        ctx.drawImage(reload_indicator, 0, 500, 70, 50);
    }

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
        bullets[i].move();
        if (checkOutside(bullets[i], i)) {
            i--;
        }
        
    }

    for (let i = 0; i < enemies.length; i++) {
        let damage = enemies[i].damage;
        enemies[i].draw();
        enemies[i].move();
        if (checkOutside(enemies[i], i)) {
            i--;
            health -= damage;
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
    if (isGameDisplay) {
        clearInterval(idTimer);
        idTimer = setInterval(main, 50);
    }
    pauseFlag = false;
}

function main() {
    if (health > 0) {

        reloadTimer++;

        Draw(ctx, canvas.width, canvas.height);

        while (enemies.length < enemiesOnLvl) {
            getRandomEnemy();
        }
    
        detectHit();
    
        level = Math.floor(score / 500) + 1;
        enemiesOnLvl = 7 + level;

    } else {
        health = 0;
        Draw(ctx, canvas.width, canvas.height);
        clearInterval(idTimer);
        alert("GAME OVER!!!");
        gameOver();
    }
}

function detectHit() {
    for (let i = 0; i < bullets.length; i++) {

        let bullet = bullets[i];

        for (let j = 0; j < enemies.length; j++) {

            let enemy = enemies[j];

            if (pointInPoly(enemy, bullet.posX, bullet.posY)) {
                score += enemy.points;
                enemies.splice(j, 1);
                j--;
            }
        }
    }
}

function checkOutside(gameObject, position) {
    if (gameObject.posX < 0 || gameObject.posY > canvas.height) {
        if (gameObject instanceof Enemy) 
        {
            enemies.splice(position, 1);
        } 
        else 
        {
            bullets.splice(position, 1);
        }
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
        setName();
    }
}

function getRandomEnemy() {

    let enemy;

    if (level > 5) {
        enemy = enemy_data[Math.floor(Math.random() * 3)];
    } else {
        enemy = enemy_data[Math.floor(Math.random() * 2)];
    }

    let x = canvas.width + randomInteger(200, 1000);
    let y = randomInteger(100, 450);
    enemies.push(new Enemy(x, y, enemy.size, enemy.speed, enemy.points, enemy.sprite, enemy.damage));
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
    clearInterval(idTimer);
    pauseFlag = true;
}

function gameOver() {
    localStorage.setItem(username, score);
    canvas.style.display = "none";
    changeDisplay();
}

function new_game() {
    setName();
    init();
    pause();
}

function changeDisplay() {
    deleteLiderboard();

    if (isGameDisplay) {
        pause();
        canvas.style.display = "none";
        showLiderboard();
        isGameDisplay = false;
    } else {
        canvas.style.display = "block";
        isGameDisplay = true;
    }
}

function showLiderboard() {

    for (let i = 0; i < localStorage.length; i++) {
        let obj = {};
        let name = localStorage.key(i);
        obj["name"] = name;
        obj["score"] = localStorage.getItem(localStorage.key(i));
        liderboard.push(obj);
    }

    liderboard.sort(function(a, b) {
        return b.score - a.score;
    });

    let html = "<table cellpadding='3' align='center' border='3'><th>ИМЯ</th><th>ОЧКИ</th>";
    for (let i = 0; i < liderboard.length && i < 15; i++) {
        html += "<tr aling=\"center\">";
        for (let j = 0; j < 1; j++) {
            html += "<td>" + liderboard[i].name + "</td>";
            html += "<td>" + liderboard[i].score + "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";

    document.getElementById("table").innerHTML = html;
    liderboard.splice(0, liderboard.length);
}

function restartGame() {
    deleteLiderboard();
    canvas.remove();
    init();
    pause();
}

function deleteLiderboard() {
    if (!isGameDisplay) {
        document.getElementById('table').firstChild.remove();
    }
}

function changePlayer() {
    canvas.remove();
    deleteLiderboard();
    new_game();
}