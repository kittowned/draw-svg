function init(): void {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const clearBtn = document.querySelector('.clearBtn') as HTMLButtonElement;
    let canDraw = false;

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth / 1.5;
        canvas.height = window.innerHeight / 1.1;
        ctx.putImageData(image, 0, 0);
    }
    resizeCanvas();


    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        if (canDraw) {
            const x = e.offsetX;
            const y = e.offsetY;
            draw(ctx, x, y);
        }
    });

    document.addEventListener('mousedown', (e: MouseEvent) => {
        canDraw = true;
        const x = e.offsetX;
        const y = e.offsetY;
        startDraw(ctx, x, y);
    });

    document.addEventListener('mouseup', () => canDraw = false);

    clearBtn.addEventListener('click', (e) => ctx.clearRect(0, 0, canvas.width, canvas.height));

    // ctx2d.strokeRect(75, 140, 150, 110);
    // ctx2d.fillRect(130, 190, 40, 60);

}

function startDraw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.moveTo(x, y);
    ctx.beginPath();
}

function draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.lineTo(x, y);
    ctx.stroke();
}

init();