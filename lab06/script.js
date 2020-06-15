'use-strict';

class Figure {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.size = this.constructor.setSize();
        this.direction = Math.floor(Math.random() * 4);
        this.color = 'rgb('+Math.floor(Math.random()*256)+','
                        +Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';     
    }

    colorShape(ctx) {
        // формируем градиентную заливку для шарика
        var gradient = ctx.createRadialGradient(this.posX+this.size/4,
        this.posY-this.size/6, this.size/8, this.posX, this.posY, this.size);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);
        return gradient;
    }

    static setSize() {
        return Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    }
}

class Ball extends Figure {      
        draw(ctx){
            ctx.fillStyle = this.colorShape(ctx);
            ctx.beginPath();
            ctx.arc(this.posX, this.posY, this.size, 0, 2*Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }

}

class Rectangle extends Figure {
    draw(ctx) {
        ctx.fillStyle = this.colorShape(ctx);
        ctx.beginPath();
        let [x, y, size] = [this.posX, this.posY, this.size];
        ctx.moveTo(x - size / 2, y - size / 2);
        ctx.lineTo(x + size / 2, y - size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x - size / 2, y - size / 2);
        ctx.closePath();
        ctx.fill();
    }

    getPoints() {
        let [x, y, size] = [this.posX, this.posY, this.size];

        return [
            [x - size / 2, y - size / 2],
            [x + size / 2, y - size / 2],
            [x + size / 2, y + size / 2],
            [x - size / 2, y + size / 2]
        ];
    }
}

class Triangle extends Figure {
    draw(ctx) {
        ctx.fillStyle = this.colorShape(ctx);
        ctx.beginPath();
        let [x, y, size] = [this.posX, this.posY, this.size];
        ctx.moveTo(x - size, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y - size);
        ctx.closePath();
        ctx.fill();
    }

    getPoints() {
        let [x, y, size] = [this.posX, this.posY, this.size];

        return [
            [x - size, y + size],
            [x + size, y + size],
            [x, y - size]
        ];
    }
}

var canvas,
    ctx,
    figures,
    idTimer,
    minSize = 5,
    maxSize = 50,
    maxFigureSize = 50,
    speed = 4,
    ticks = 0,
    figureDirection = 4;

const DISNANCE = 9999999;

var directions = [
    // top
    (x, y) => {
        x += Math.floor(Math.random() * 5) - 2;
        y += Math.floor(Math.random() * 2) - speed;
        return [x, y];
    },
    // bottom
    (x, y) => {
        x += Math.floor(Math.random() * 5) - 2;
        y += Math.floor(Math.random() * 2) + speed;
        return [x, y];
    },
    // left
    (x, y) => {
        x += Math.floor(Math.random() * 2) - speed;
        y += Math.floor(Math.random() * 5) - 2;
        return [x, y];
    },
    // right
    (x, y) => {
        x += Math.floor(Math.random() * 2) + speed;
        y += Math.floor(Math.random() * 5) - 2;
        return [x, y];
    },
    // chaos
    (x, y) => {
        return directions[Math.floor(Math.random() * 4)](x, y);
    }
];

let typeOfFigure = [Rectangle, Ball, Triangle];

// инициализация работы
function init() {

    canvas = document.getElementById('canvas');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');

        //рисуем фон
        Draw(ctx,'#202020', '#aaa', canvas.width, canvas.height);

        document.getElementById('speedValue').addEventListener('change', function(e) {
            speed = +document.getElementById('speedValue').value;
        });

        document.getElementById('sizeValue').addEventListener('change', function(e) {
            maxFigureSize = document.getElementById('sizeValue').value;
        });

        //создаем 10 шариков, заноси их в массив и выводим на canvas
        figures = [];

        for (var i = 0; i <= 10; i++){
            var item = new typeOfFigure[getRandomFigure()](10+Math.random()*(canvas.width-30),
            10+Math.random()*(canvas.height-30));
            item.draw(ctx);
            figures.push(item);
        }
    }
}

// создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
function mouseClickHandler(event){
    var x = event.clientX;
    var y = event.clientY;
    var item = new typeOfFigure[getRandomFigure()](x, y);
    item.draw(ctx);
    figures.push(item);
}

function Draw(ctx, col1, col2, w, h){
    // закрашиваем канвас градиентным фоном
    ctx.save();
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(1, col1);
    g.addColorStop(0, col2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

function getRandomFigure() {
    return Math.floor(Math.random() * typeOfFigure.length);
}

function move() {
    clearInterval(idTimer);
    idTimer = setInterval(moveShapes, 50);
}

function changeDirection(mode) {
    figureDirection = mode;
    move();
}


function moveShapes() {
    // реализация движения шариков, находящихся в массиве figures
    Draw(ctx, '#202020', '#aaa', canvas.width, canvas.height);

    for (var i = 0; i < figures.length; i){
        
        figures[i].size += 0.25;

        if (figures[i].size > maxFigureSize) {
            figures.splice(i, 1);
            continue;
        }

        [figures[i].posX, figures[i].posY] = directions[figureDirection === undefined ? figures[i].direction : figureDirection](figures[i].posX, figures[i].posY);

        figures[i].draw(ctx);

        if ((figures[i].posX > canvas.width)|| (figures[i].posY > canvas.height) || (figures[i].posX < 0) ||(figures[i].posY < 0)) {
            figures.splice(i,1);
        }
        else {
            if (!checkCollisions(figures[i])) {
                i++;
            }
        }
    }
}

function checkCollisions(figure) {
    for (let i = 0; i < figures.length; i++) {

        if (figures[i] == figure) {
            continue;
        }

        let enemy = figures[i];

        // Detect the collision between Ball and Ball
        if (enemy instanceof Ball && figure instanceof Ball) {             
            let dx = figure.posX - enemy.posX;
            let dy = figure.posY - enemy.posY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < figure.size + enemy.size) {
                figures.splice(figures.indexOf(figure, 0), 1);
                figures.splice(figures.indexOf(enemy, 0), 1);
                return true;
            }
            
        }
        // Detect the collision Rectangles or Triangles
        else if (!(enemy instanceof Ball || figure instanceof Ball)) {
            let [figurePoints, enemyPoints] = [figure.getPoints(), enemy.getPoints()];

            for (let point of enemyPoints) {
                if (pointInPoly(figurePoints, point[0], point[1])) {
                    figures.splice(figures.indexOf(figure, 0), 1);
                    figures.splice(figures.indexOf(enemy, 0), 1);
                    return true;
                }
            }
        // Detect the collision between Ball and an another shape
        } else {
            var ball,
                shape;

            if (enemy instanceof Ball) {
                ball = enemy;
                shape = figure;
            } else {
                ball = figure;
                shape = enemy;
            }
            
            var pointsOfShapes = shape.getPoints();

            let distance = DISNANCE;
            for (let i = 0; i < pointsOfShapes.length; i++) {
                let dx = pointsOfShapes[i][0] - ball.posX;
                let dy = pointsOfShapes[i][1] - ball.posY;
                let tmpDistance = Math.sqrt(dx * dx + dy * dy);
                distance = tmpDistance < distance ? tmpDistance : distance;
            }
            if (ball.size >= distance || pointInPoly(pointsOfShapes, ball.posX, ball.posY)) {
                figures.splice(figures.indexOf(shape, 0), 1);
                figures.splice(figures.indexOf(ball, 0), 1);
                return true;
            }
        }
    }
    return false;
}

function pointInPoly(figurePoints, pointX, pointY)
{
    let destroy = 0;

	for (let i = 0, j = figurePoints.length - 1; i < figurePoints.length; j = i++)
	{
        if (((figurePoints[i][1] > pointY) != (figurePoints[j][1] > pointY)) && 
        (pointX < (figurePoints[j][0] - figurePoints[i][0]) * (pointY - figurePoints[i][1]) / 
        (figurePoints[j][1] - figurePoints[i][1]) + figurePoints[i][0]))
		{
            destroy = !destroy;
		}
 
	}
 
	return destroy;
}