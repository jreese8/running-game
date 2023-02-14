//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//player
let playerWidth = 88;
let playerHeight = 94;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;

let player = {
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

}