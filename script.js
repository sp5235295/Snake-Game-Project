const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
const scoreEl=document.getElementById("score");
const eatSound=document.getElementById("eatSound");
const gameOverSound=document.getElementById("gameOverSound");
const bgMusic=document.getElementById("bgMusic");
const grid=20;

let snake,dx,dy,food,score,gameInterval,foodColor;

function init(){
  snake=[{x:160,y:200}];
  dx=grid; dy=0;
  food=randomFood();
  score=0;
  scoreEl.textContent=score;
  draw();
}

function start(){
  if(gameInterval) clearInterval(gameInterval);
  gameInterval=setInterval(gameLoop,200);
  bgMusic.play();
}

function pause(){
  if(gameInterval) clearInterval(gameInterval);
  bgMusic.pause();
}

function restart(){
  pause();
  init();
  start();
}

function randomBrightColor(){
  const colors=["#ff0000","#ff4500","#ff1493","#ffff00","#00ffff","#ff69b4"];
  return colors[Math.floor(Math.random()*colors.length)];
}

function randomFood(){
  foodColor=randomBrightColor();
  return {
    x:Math.floor(Math.random()*20)*grid,
    y:Math.floor(Math.random()*20)*grid
  };
}

function gameLoop(){
  update();
  draw();
}

function update(){
  const head={x:snake[0].x+dx,y:snake[0].y+dy};
  if(head.x<0||head.x>=canvas.width||head.y<0||head.y>=canvas.height||snake.some(p=>p.x===head.x&&p.y===head.y)){
    pause();
    gameOverSound.play();
    alert("Game Over! Score: "+score);
    return;
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    score++; scoreEl.textContent=score;
    eatSound.play();
    food=randomFood();
  } else {
    snake.pop();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#2e8b57"; // light dark green
  ctx.shadowBlur = 0;
  snake.forEach(p=>ctx.fillRect(p.x,p.y,grid-2,grid-2));

  ctx.fillStyle=foodColor;
  ctx.beginPath();
  ctx.arc(food.x+grid/2, food.y+grid/2, grid/2-2, 0, Math.PI*2);
  ctx.fill();
}

document.addEventListener("keydown",e=>{
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
    e.preventDefault();
  }
  if(e.key==="ArrowUp"&&dy===0){dx=0;dy=-grid;}
  if(e.key==="ArrowDown"&&dy===0){dx=0;dy=grid;}
  if(e.key==="ArrowLeft"&&dx===0){dx=-grid;dy=0;}
  if(e.key==="ArrowRight"&&dx===0){dx=grid;dy=0;}
});

// Mobile button controls
document.getElementById("upBtn").addEventListener("click", ()=>{if(dy===0){dx=0; dy=-grid;}});
document.getElementById("downBtn").addEventListener("click", ()=>{if(dy===0){dx=0; dy=grid;}});
document.getElementById("leftBtn").addEventListener("click", ()=>{if(dx===0){dx=-grid; dy=0;}});
document.getElementById("rightBtn").addEventListener("click", ()=>{if(dx===0){dx=grid; dy=0;}});

document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("pauseBtn").addEventListener("click",pause);
document.getElementById("restartBtn").addEventListener("click",restart);

init();
