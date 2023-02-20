//board
let board;
let boardWidth = 637;
let boardHeight = 250;
let context;

//player character
let playerWidth = 40;
let playerHeight = 54;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;

let player = {
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

//enemies
let enemyArray = [];

let enemy1Width = 53; //Soldier
let enemy2Width = 78; //Alien
let enemy3Width = 95; // Egg Pawn

let enemyHeight = 80;

let enemyX = 700;

let enemyY = boardHeight - enemyHeight;

let enemy1Img;
let enemy2Img;
let enemy3Img;

//physics
let velocityX = -8; //enemy moving left because negative is left & positive is right
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let score = 0;

function boardFunction() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d")//used for drawing on the board

    playerImg = new Image();
    playerImg.src = "./assets/Shadow.png";
    playerImg.onclick = function() {
        
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    enemy1Img = new Image();
    enemy1Img.src ="./assets/Soldier.png";

    enemy2Img = new Image();
    enemy2Img.src ="./assets/Alien.png";

    enemy3Img = new Image();
    enemy3Img.src ="./assets/eggPawn.png";

    requestAnimationFrame(update);
    setInterval(placeEnemy, 1000)//1000 milliseconds = 1 second
    document.addEventListener('touchstart', movePlayer);
    document.addEventListener("keydown", movePlayer);

    var audio = new Audio("./assets/Westopolis.mp3");
    audio.play();
    audio.loop = true;
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

    //enemies
    for (let i = 0; i < enemyArray.length; i++) {
        let enemy = enemyArray[i];
        enemy.x += velocityX;
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);

        if (detectCollision(player, enemy)) {
            gameOver = true;
            // playerImg.src = "./assets/ShadowDeath.png"; //need to fix this simply displaying on top of the previous img rather than overwriting it...
            // playerImg.onload = function() {
            //     context.drawImage(playerImg, player.x, player.y, player.width, player.height);
            // }

            //let player know game is over
            window.alert("Game Over!");
  
            // check localStorage for high score, if it's not there, use 0
            var highScore = localStorage.getItem("highscore");
                if (highScore === null) {
                    highScore = 0;
                }
  
            // if player has a higher score than the previous high score, high score will be updated
            if (score > highScore) {
                localStorage.setItem("highscore", score);
                alert(" The new highscore is " + score + "!");
                } else {
                alert( highScore + " is still the reigning highscore.");
                }
  
            // ask player if they'd like to play again
            var playAgainConfirm = window.confirm("Play again?");
                if (playAgainConfirm) {
                window.location.reload();
                } else {
                window.alert("Thank you for playing Shadow The Hedgehog: Running Game.");
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

    if (e.touches && player.y == playerY) {
        velocityY = -10;
      }

}

function placeEnemy() {
    if (gameOver) {
        return;
    }

    //place enemy
    let enemy = {
        img : null,
        x : enemyX,
        y : enemyY,
        width : null,
        height : enemyHeight
    }

    let placeEnemyChance = Math.random(); // 0 - 0.99999.....

    if (placeEnemyChance > .90) { // 10% for enemy1
        enemy.img = enemy1Img;
        enemy.width = enemy1Width;
        enemyArray.push(enemy);
    }
    else if (placeEnemyChance > .70) { // 30% for enemy2
        enemy.img = enemy2Img;
        enemy.width = enemy2Width;
        enemyArray.push(enemy);
    }
    else if (placeEnemyChance > .50) { // 50% for enemy3
        enemy.img = enemy3Img;
        enemy.width = enemy3Width;
        enemyArray.push(enemy);
    }
    if (enemyArray.length > 5) {
        enemyArray.shift(); //remove 1st element from array so that array won't continue to grow
    }

}

function detectCollision (a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function setInput(button) {
    button.style.display = 'none';
    boardFunction();
 }