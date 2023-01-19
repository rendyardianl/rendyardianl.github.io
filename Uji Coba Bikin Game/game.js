const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
// kita akan butuh gamecontainer untuk membuatnya terlihat buram ketika kita menampilkan end-menu
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image()
flappyImg.src ='asset/bluebird-midflap.png';

//game constants
const FLAP_SPEED = -5;
const BIRD_WIDHT = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH =  50;
const PIPE_GAP = 125;

// Bird varibles
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score & highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// kita tambahkan variabel boolean, jadi kita bisa periksa ketika burung lewat score kita naik
let scored = false;

// kita kendalikan burung dengan tombol spasi
document.body.onkeyup = function(e){
    if (e.code == 'Space'){
        birdVelocity = FLAP_SPEED;
    }
}

// kita ulangi game jika kita terkena game-over
document.getElementById('restart-button').addEventListener('click', function(){
    hideEndMenu();
    resetGame();
    loop();
})


function increaseScore(){
    // tingkatkan sekarang penghitung kita saat burung melewati pipa
    if(birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }
    // reset tanda, jika burung melewati pipa
    if(birdX < pipeX + PIPE_WIDTH){
        scored = false;
    } 
}

function collisionCheck(){
    // buat kotak pembatas untuk burung dan pipa

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDHT,
        height: BIRD_HEIGHT,
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY,
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP,
    }

    // periksa tabrakan dengan kotak pipa atas
    if(birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y){
        return true;
    }

    // periksa tabrakan dengan kota pipa bawah
    if(birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width &birdBox.y + birdBox.height > bottomPipeBox.y){
        return true;
    }

    // periksa jika burung terkana pembatas
    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }

    return false;
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // ini cara kita selalu update highscore kita diakhir permainan, jika kita punya highscore sebelumnya
    if(highScore < score){
        highScore=score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// kita reset nilai dipermulaan maka kita mulai dengan burung dipermulaan
function resetGame(){
    // variabel burung
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    // variabel pipa
    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame(){
    showEndMenu();
}

function loop(){
    // setel ulang ctx setelah setiap iterasi loop
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // gambar flappy bird
    ctx.drawImage(flappyImg, birdX, birdY);

    // gambar pipa
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //sekarang kita perlu menambahkan cek tabrakan untuk tampilan end-menu kita dan diakhir game
    // pemeriksaan tabrakan akan mengembalikan nilai true jika kita mengalami tabrakan, selain itu salah
    if(collisionCheck()){
        endGame();
        return;
    }


    // menambahkan pipa
    pipeX -= 1.5;
    // jika pipa bergerak diluar bingkai, kita perlu mereset pipa
    if(pipeX < -50){
       pipeX = 400;
       pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }
     

    // menerapkan gravitasi pada burung dan membiarkannya bergerak
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    // selalu periksa jika memanggil function...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();