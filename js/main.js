(function () {

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

// Init settings
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener('click', mouseClickHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        } else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        } else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddle.x = relativeX - paddle.width / 2;
        }
    }

    function mouseClickHandler() {
        if (!ball.live)
            ball.live = true;
    }

    let ball = {x: 0, y: 0, radius: 8, live: false, speed: 3.5};
    let dx = ball.speed, dy = ball.speed;
    let paddle = {x: 400, y: canvas.height, height: 10, width: 85};
    paddle.y = canvas.height - paddle.height;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 12;
    let brickColumnCount = 11;
    let brickWidth = 60;
    let brickHeight = 20;
    let brickPadding = 1;
    let brickOffsetTop = 80;
    let brickOffsetLeft = 65;
    let score = 0;
    ball.x = paddle.x + (paddle.width / 2);
    ball.y = paddle.y - ball.radius;
    let level = 1;
    let lives = 3;
    let bricks = [];

    function initBricksForLevel(level) {
        let levelData = getLevels(level);
        if (levelData != undefined) {
            ball.live = false;
            for (let c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (let r = 0; r < brickRowCount; r++) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    let brickStr = levelData[r][c];
                    bricks[c][r] = {x: brickX, y: brickY, strength: brickStr};
                }
            }
        } else {
            alert('You win!');
            document.location.reload();
        }
    }

    initBricksForLevel(level);


    function main() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        update();
        render();

        requestAnimationFrame(main)
    }

    function update() {

        function updateLives(score) {
            if (score % 200 == 0)
                lives++;
        }

        function ballUpdate() {
            if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
                dx = -dx;
            }
            if (ball.y + dy < ball.radius) {
                dy = -dy;
            } else if (ball.y + dy + ball.radius > canvas.height) {
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    dy = -dy;
                } else {
                    if (lives <= 0) {
                        alert("GAME OVER");
                        document.location.reload();
                    }
                    else {
                        lives--;
                        ball.live = false;
                    }
                }
            }

            if (rightPressed && paddle.x < canvas.width - paddle.width) {
                paddle.x += 7;
            } else if (leftPressed && paddle.x > 0) {
                paddle.x -= 7;
            }
            if (ball.live) {
                ball.x += dx;
                ball.y += dy;
            } else {
                ball.x = paddle.x + (paddle.width / 2);
                ball.y = paddle.y - ball.radius;
            }
        }

        function brickUpdate() {
            let bricksLeft = 0;
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    let brick = bricks[c][r];
                    //Check how many bricks have left
                    bricksLeft += brick.strength;
                    // Collision detection with ball
                    if (brick.strength > 0) {
                        let check = rectCircleColliding(ball, brick);
                        if (check == 'x') {
                            bricks[c][r].strength--;
                            score++;
                            dy = -dy;
                            updateLives(score);
                        }
                        else if (check == 'y') {
                            bricks[c][r].strength--;
                            score++;
                            dx = -dx;
                            updateLives(score);
                        }
                        else if (check == 'corner') {
                            bricks[c][r].strength--;
                            score++;
                            dx = -dx;
                            dy = -dy;
                            updateLives(score);
                        }
                    }
                }
            }
            if (bricksLeft == 0) {
                level++;
                initBricksForLevel(level);

            }
        }

        function rectCircleColliding(circle, rect) {

            let distX = Math.abs(circle.x - rect.x - brickWidth / 2);
            let distY = Math.abs(circle.y - rect.y - brickHeight / 2);

            if (distX > (brickWidth / 2 + circle.radius)) {
                return false;
            }
            if (distY > (brickHeight / 2 + circle.radius)) {
                return false;
            }

            if (distX <= (brickWidth / 2)) {
                return 'x';
            }
            if (distY <= (brickHeight / 2)) {
                return 'y';
            }

            let dx = distX - brickWidth / 2;
            let dy = distY - brickHeight / 2;
            let corner = (dx * dx + dy * dy <= (circle.radius * circle.radius))
            if (corner)
                return 'corner';
        }

        ballUpdate();
        brickUpdate();
    }

    function render() {

        function grid() {
            ctx.save();

            ctx.strokeStyle = 'grey';
            ctx.lineWidth = 0.25;
            for (let row = 0; row < 60; row++) {
                if (row % 5 == 0) ctx.lineWidth = 0.5;
                if (row % 10 == 0) ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, row * 10);
                ctx.lineTo(800, row * 10);
                ctx.stroke();
                if (row % 5 == 0) ctx.lineWidth = 0.25;
            }
            for (let col = 0; col < 80; col++) {
                if (col % 5 == 0) ctx.lineWidth = 0.5;
                if (col % 10 == 0) ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(col * 10, 0);
                ctx.lineTo(col * 10, 600);
                ctx.stroke();
                if (col % 5 == 0) ctx.lineWidth = 0.25;
            }

            ctx.restore();
        }

        function drawText(text, x, y) {
            ctx.save();
            ctx.font = "18px Arial";
            ctx.fillStyle = "#2eafff";
            ctx.fillText(text, x, y);
            ctx.restore()
        }

        function drawBricks() {
            ctx.save();
            ctx.strokeStyle = 'white';
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].strength > 0) {
                        let red = 0, green = 0, blue = 0;
                        switch (bricks[c][r].strength) {
                            case 1:
                                green = blue = 255;
                                break;
                            case 2:
                                red = blue = 255;
                                break;
                            case 3:
                                red = green = 255;
                                break;
                            case 4:
                                green = 255;
                                break;
                            case 5:
                                blue = 255;
                                break;
                            case 6:
                                red = 255;
                                break;
                        }
                        ctx.beginPath();
                        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                        ctx.strokeRect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                        ctx.fillStyle = `rgba(${red},${green},${blue},1)`;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
            ctx.restore();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
            ctx.fillStyle = '#0095DD';

            ctx.fill();
            ctx.closePath();
        }

        function drawTheBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }

        drawPaddle();
        drawTheBall();
        drawBricks();
        drawText("Score: " + score, 8, 20);
        drawText("Level: " + level, 8, 40);
        drawText("Lives: " + lives, 720, 20);
    }

    function cls() {
        ctx.clearRect(0, 0, 800, 600);
    }

    function res() {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = ' black';
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
    }


    requestAnimationFrame(main);
//setInterval(main, 10);
})();

// Levels
function getLevels(n) {
    let levels = new Map();

    levels['level1'] = [
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2]
    ];

    levels['level2'] = [
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 2],
        [5, 5, 5, 5, 5, 5, 5, 5, 4, 1, 2],
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
        [2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2],
        [1, 2, 3, 4, 5, 6, 4, 2, 1, 1, 2],
        [1, 2, 3, 4, 5, 6, 4, 2, 1, 1, 2],
        [1, 2, 3, 4, 5, 6, 4, 2, 1, 1, 2],
        [1, 2, 3, 4, 5, 6, 4, 2, 1, 1, 2],
        [1, 2, 3, 4, 5, 6, 4, 2, 1, 1, 2],
        [1, 2, 3, 4, 5, 6, 4, 2, 1, 1, 2],

    ];

    return levels[`level${n}`];
}