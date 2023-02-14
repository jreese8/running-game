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

//cacti
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cacti moving left because negative is left & positive is right
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d")//used for drawing on the board

    playerImg = new Image();
    playerImg.src = "./assets/player.png";
    playerImg.onload = function() {
        
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    cactus1Img = new Image();
    cactus1Img.src ="./assets/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src ="./assets/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src ="./assets/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000)//1000 milliseconds = 1 second
    document.addEventListener("keydown", movePlayer);
}

function update() {

    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //player
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY); //apply gravity to player.y; making sure it doesn't fall thru floor
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(player, cactus)) {
            gameOver = true;
            playerImg.src = "./assets/playerdead.png";
            playerImg.onload = function() {
                context.drawImage(playerImg, player.x, player.y, player.width, player.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);

}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && player.y == playerY) { //playerY is default position
        //jump
        velocityY = -10;
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cacti
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height : cactusHeight
    }

    let placeCactusChance = Math.random(); // 0 - 0.99999.....

    if (placeCactusChance > .90) { // 10% for cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { // 30% for cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { // 50% for cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove 1st element from array so that array won't continue to grow
    }

}

function detectCollision (a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}