function ellipseSquare(a, b) {
    return Math.PI * a * b;
}

function getRandomInt() {
    return Math.floor(Math.random() * (100 - 0) + 0);
}

function getArray(n) {
    var A = [];
    for (let i = 0; i < n; i++) {
        A.push(getRandomInt());
    }
    return A;
}

function getResultArray(A) {
    A.sort(function compareFunction(a, b) {
        if (a - b < 0) {
            return -1;
        }
        else if (a - b > 0) {
            return 1;
        }
        else { return 0;}
    }); 
    
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
    var x = document.getElementById("input-x").value;
    var sum = 0;
    if (x >= 1) {
        alert("Неверное значение");
    }
    else {
        for (let i = 0; Math.abs(Math.pow(-1, i) * Math.pow(3, i) * Math.pow(x, i)) > 0.006; i++) {
            sum += Math.pow(-1, i) * Math.pow(3, i) * Math.pow(x, i);
        }
        document.getElementById("result2").value = sum;
    }
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

function func4(rang) {
    var array = getResultArray(getArray(Math.pow(rang, 2))).reverse();
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
      console.log(matrix);
}