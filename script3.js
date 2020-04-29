'use strict';

let N = 6,
    M = 6,
    sum = 0,
    matrix = [ [], [], [], [], [], [] ];


for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
        matrix[i][j] = getRandomInt();
    }
}

for (let i = 0; i < 6; i++) {
    sum += matrix[i][i];
}

for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
        matrix[i][j] -= sum;
    }
}


function getRandomInt() {
    return Math.floor(Math.random() * (64000 - (-64000)) + (-64000));

}

