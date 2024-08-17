let character = document.getElementById('character');
let obstaclesContainer = document.getElementById('obstacles-container');
let scoreElement = document.getElementById('score');
let gameOverElement = document.getElementById('game-over');

let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));

let groundHeight = parseInt(window.getComputedStyle(document.getElementById('ground')).getPropertyValue('height'));

let isJumping = false;
let upTime;
let downTime;
let score = 0;
let gameOver = false;

function jump() {
    if (isJumping || gameOver) return;
    isJumping = true;
    upTime = setInterval(() => {
        if (characterBottom >= groundHeight + 250) {
            clearInterval(upTime);
            downTime = setInterval(() => {
                if (characterBottom <= groundHeight + 10) {
                    clearInterval(downTime);
                    isJumping = false;
                }
                characterBottom -= 10;
                character.style.bottom = characterBottom + 'px';
            }, 20);
        }
        characterBottom += 10;
        character.style.bottom = characterBottom + 'px';
    }, 20);
}

function generateObstacle() {
    if (gameOver) return;

    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstaclesContainer.appendChild(obstacle);

    let obstacleRight = 0;
    let obstacleWidth = 30;
    let obstacleHeight = Math.floor(Math.random() * 50) + 50;
    obstacle.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

    obstacle.style.width = obstacleWidth + 'px';
    obstacle.style.height = obstacleHeight + 'px';
    obstacle.style.right = obstacleRight + 'px';
    obstacle.style.bottom = '100px';

    function moveObstacle() {
        if (gameOver) return;
        let currentRight = parseInt(obstacle.style.right);
        obstacle.style.right = (currentRight + 5) + 'px';  // Moving obstacle towards the character

        let obstacleLeft = window.innerWidth - currentRight - obstacleWidth;
        let characterRight = characterLeft + characterWidth;

        // Collision detection
        if (
            characterLeft < obstacleLeft + obstacleWidth &&
            characterRight > obstacleLeft &&
            characterBottom <= 100 + obstacleHeight
        ) {
            gameOver = true;
            clearInterval(obstacleInterval);
            document.removeEventListener('keydown', control);
            document.removeEventListener('touchstart', jump);
            gameOverElement.style.display = 'block';
            return;
        }

        // Remove obstacle if it goes off-screen
        if (obstacleLeft + obstacleWidth < 0) {
            clearInterval(obstacleInterval);
            obstaclesContainer.removeChild(obstacle);
            if (!gameOver) {
                score++;
                scoreElement.textContent = 'Score: ' + score;
            }
        }
    }

    let obstacleInterval = setInterval(moveObstacle, 20);
    setTimeout(generateObstacle, 2000);
}

function control(e) {
    if (e.key === 'ArrowUp' || e.key === ' ') {
        jump();
    }
}

document.addEventListener('keydown', control);
document.addEventListener('touchstart', jump);

generateObstacle();
