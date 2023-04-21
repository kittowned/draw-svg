"use strict";
function init() {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.querySelector('.clearBtn');
    let canDraw = false;
    let lineWidth = 1.0;
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth / 1.5;
        canvas.height = window.innerHeight / 1.1;
        ctx.putImageData(image, 0, 0);
    }
    function startDraw(ctx, x, y) {
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(x, y);
        ctx.beginPath();
    }
    function draw(ctx, x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    resizeCanvas();
    canvas.addEventListener('click', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    document.addEventListener('mousedown', (e) => {
        canDraw = true;
        const x = e.offsetX;
        const y = e.offsetY;
        startDraw(ctx, x, y);
    });
    canvas.addEventListener('mousemove', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        if (canDraw) {
            draw(ctx, x, y);
        }
    });
    document.addEventListener('mouseup', () => {
        console.log(ctx);
        canDraw = false;
    });
    document.addEventListener('wheel', (e) => {
        const step = 3;
        if (e.deltaY < 0) {
            lineWidth += step;
        }
        else if (lineWidth >= step - 1) {
            lineWidth -= step;
        }
    });
    clearBtn.addEventListener('click', (e) => ctx.clearRect(0, 0, canvas.width, canvas.height));
    // function animate() {
    //     requestAnimationFrame(animate);
    // }
    // animate();
    // ctx2d.strokeRect(75, 140, 150, 110);
    // ctx2d.fillRect(130, 190, 40, 60);
}
init();
