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
}

var canvas,
    ctx,
    figures,
    idTimer,
    minSize = 5,
    maxSize = 50,
    maxFigureSize,
    speed = 4,
    ticks = 0,
    figureDirection = 4;

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
        return directions[Math.floor(Math.random() * 3)](x, y);
    }
];

let typeOfFigure = [Rectangle, Ball, Triangle];

// инициализация работы
function init(){

    canvas = document.getElementById('canvas');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');

        //рисуем фон
        Draw(ctx,'#202020', '#aaa', canvas.width, canvas.height);
        setMaxFigureSize();

        //создаем 10 шариков, заноси их в массив и выводим на canvas
        figures = [];

        for (var i = 0; i<= 500; i++){
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
    var g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(1,col1);
    g.addColorStop(0,col2);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    ctx.restore();
}

function getRandomFigure() {
    return Math.floor(Math.random() * typeOfFigure.length);
}

function move() {
    clearInterval(idTimer);
    idTimer = setInterval(moveShapes, 50);
}


function setSpeed() {
    speed = +document.getElementById('speedValue').value;
}

function setMaxFigureSize() {
    maxFigureSize = document.getElementById('sizeValue').value;
}

function changeDirection(mode) {
    figureDirection = mode;
    move();
}


function moveShapes(){
    // реализация движения шариков, находящихся в массиве figures
    Draw(ctx, '#202020', '#aaa', canvas.width, canvas.height);

    for (var i = 0; i < figures.length;i){
        
        figures[i].size++;

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
            i++;
        }

    }
}