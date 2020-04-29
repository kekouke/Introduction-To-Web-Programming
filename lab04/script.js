'use strict';

const pi = 3.1415;
let a, b;

inputData();
alert(ellipseSquare(a, b).toFixed(2));


function inputData() {
    for (let i = 0; i < 1; i++) {
        a = +prompt("Длина большой полуоси (a): ");
        b = +prompt("Длина большой полуоси (b): ");

        if (a == '' || b == '') {
            alert("Длины одной или двух полуосей не назначены");
            i--;
        } else if (isNaN(a) || isNaN(b)) {
            alert("Длины полуосей должны иметь числовое значение");
            i--;
        }
    }
}

function ellipseSquare(a, b) {
    return pi * a * b;
}