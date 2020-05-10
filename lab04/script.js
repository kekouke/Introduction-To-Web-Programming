'use-strict';

function ellipseSquare(a, b) {
    return Math.PI * a * b;
}

function getRandomInt(min, max) {


    return max >= min ? Math.floor(Math.random() * (max - min) + min) : 1;
}

function getArray(n) {
    var min = Number(document.getElementById("min").value);
    var max = Number(document.getElementById("max").value);

    if (max >= min) {
        var A = [];
        for (let i = 0; i < n; i++) {
            A.push(getRandomInt(min, max));
        }
        return A;
    } else {
        alert("Ошибка!");
        return 1;
    }


}

function getResultArray(A) {
    A.sort((a, b) => b - a);   
    return A;
}

function func1() {
    var a = document.getElementById("semiaxis-a").value;
    var b = document.getElementById("semiaxis-a").value;

    if (a <= 0 || b <= 0) {
        alert("Неверное значение одной или двух полуосей!");
    }
    else {
        document.getElementById("result1").value = ellipseSquare(a, b).toFixed(3);
    }
}

function func2() {
    var x = document.getElementById('input-x').value;

    if (x >= 1) {
        alert("Неверное значение");
        return 2;
    }

    var sum = 0;
    var tmp = 1;

    for (let i = 1; Math.abs(tmp) > 0.006; i++) {
        sum += tmp;
        tmp = Math.pow(-1, i) * Math.pow(3, i) * Math.pow(x, i);
    }
    document.getElementById("result2").value = sum.toFixed(4);
    console.log(sum);
}

function func3() {
    var sum = 0;
    var matrix = document.getElementsByClassName("matrix-val");

    for (let i = 0; i < 6; i++) {
        sum += +matrix[i + i * 6].value;
    }

    for (let i = 0; i < 36; i++) {
        matrix[i].value -= sum;
    }
}

function func4() {
    var rang = Number(document.getElementById("rang").value);

    if (rang <= 0 || rang > 16) {
        alert("Ошибка!");
        return 37;
    }

    var array = getResultArray(getArray(Math.pow(rang, 2)));

    var matrix = [];

    for (let i = 0; i < rang; i++) {
        matrix.push([]);
    }

    for (let column = 0; column < rang; column++) {
        
        if (column % 2 == 0) {
            for (let i = 0; i < rang; i++) {
                matrix[i][column] = array.shift();
            }
        }

        if (column % 2 == 1) {
            for (let i = rang - 1; i >=0; i--) {
                matrix[i][column] = array.shift();
            }
        }     
    }

    var table = '<table cellpadding="5">';

    for (i = 0; i < rang; i++){
        table = table + '<tr>';
            for (j = 0; j < rang; j++){
                table = table + '<td>' + " " + matrix[i][j] + " " + '</td>'; 
          }
          table = table + '</tr>';
    }
    table = table + '</table>';
    
    document.getElementById('table').innerHTML = table;
}