function draw() {
    ctx.beginPath();
    ctx.arc(75,75,50,0,Math.PI*2,true);
    ctx.moveTo(110,75);
    ctx.arc(75,75,35,0,Math.PI,false);
    ctx.moveTo(65,65);
    ctx.arc(60,65,5,0,Math.PI*2,true);
    ctx.moveTo(95,65);
    ctx.arc(90,65,5,0,Math.PI*2,true);
    ctx.stroke();
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