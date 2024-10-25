const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.5, lift: -10, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 90 === 0) {
        let top = Math.random() * (canvas.height - 200) + 50;
        let bottom = Math.random() * (canvas.height - top - 150) + 50;
        pipes.push({ x: canvas.width, top, bottom, width: 40 });
    }
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
            if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
                gameOver = true;
            }
        }
    });
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height >= canvas.height) {
            bird.y = canvas.height - bird.height;
            gameOver = true;
        }

        drawBird();
        updatePipes();
        drawPipes();
        checkCollision();

        if (frame % 90 === 0) {
            score++;
            document.getElementById("score").innerText = score;
        }

        frame++;
        requestAnimationFrame(update);
    } else {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
    }
}

document.addEventListener("keydown", () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        // Reset game
        pipes = [];
        score = 0;
        gameOver = false;
        bird.y = 150;
        bird.velocity = 0;
        frame = 0;
        update();
    }
});

update();
