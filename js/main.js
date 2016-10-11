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

    let ball = {x: 0, y: 0, radius: 10, live: false, speed: 3};
    let dx = ball.speed, dy = ball.speed;
    let paddle = {x: 400, y: canvas.height, height: 10, width: 85};
    paddle.y = canvas.height - paddle.height;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 6;
    let brickColumnCount = 8;
    let brickWidth = 72;
    let brickHeight = 30;
    let brickPadding = 10;
    let brickOffsetTop = 80;
    let brickOffsetLeft = 75;
    let score = 0;
    ball.x = paddle.x + (paddle.width / 2);
    ball.y = paddle.y - ball.radius;

    let bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r] = {x: brickX, y: brickY, strength: 1};
        }
    }

    function main() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        update();
        render();

        requestAnimationFrame(main)
    }

    function update() {
        function ballUpdate() {
            if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
                dx = -dx;
            }
            if (ball.y + dy < ball.radius) {
                dy = -dy;
            } else if (ball.y + dy > canvas.height - ball.radius) {
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    dy = -dy;
                } else {
                    alert("GAME OVER");
                    document.location.reload();
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
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    let brick = bricks[c][r];
                    // Collision detection with ball
                    if (brick.strength > 0) {
                        if (rectCircleColliding(ball, brick)) {
                            bricks[c][r].strength--;
                            dy = -dy;
                        }
                    }

                }
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
                return true;
            }
            if (distY <= (brickHeight / 2)) {
                return true;
            }

            let dx = distX - brickWidth / 2;
            let dy = distY - brickHeight / 2;
            return (dx * dx + dy * dy <= (circle.radius * circle.radius));
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

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Score: " + score, 8, 20);
        }

        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].strength > 0) {
                        ctx.beginPath();
                        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                        ctx.fillStyle = `rgba(${(r + c) * 5},${(r + c) * 10},${(r + c) * 15},1`;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
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

        drawBricks();
        drawTheBall();
        drawPaddle();
        drawScore();
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