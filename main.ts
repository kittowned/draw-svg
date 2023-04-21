function init(): void {
    /**
     * Elements
     */
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    const colorControls = document.querySelector('colors') as HTMLElement;
    const clearBtn = document.querySelector('.clearBtn') as HTMLButtonElement;
    clearBtn.addEventListener('click', () => {
        clearHistory(history);
        clearCanvas(ctx, canvas)
    });

    /**
     * Initial state
     */
    let canDraw: boolean = false;
    let lineWidth: number = 1.0;
    let lineCap: CanvasLineCap = "round";
    let lineJoin: CanvasLineJoin = "round";
    const history: ImageData[] = [];
    const colors: string[] = ['red', 'green', 'blue'];
    const colorElements = colors.map(color => {
        
    })

    /** Resize handler */
    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas() {
        const image = getImageFromCanvas(ctx, canvas);
        canvas.width = window.innerWidth / 1.5;
        canvas.height = window.innerHeight / 1.1;
        ctx.putImageData(image, 0, 0);
    }

    resizeCanvas();

    document.addEventListener('mousedown', (e: MouseEvent) => {
        canDraw = true;
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.moveTo(x, y);
        ctx.beginPath();
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        const x = e.offsetX;
        const y = e.offsetY;
        if (canDraw) {
            const penState: PenState = { lineWidth, lineCap, lineJoin };
            setPenState(ctx, penState);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    });

    document.addEventListener('mouseup', () => {
        canDraw = false
        const newImage = getImageFromCanvas(ctx, canvas);
        history.push(newImage);
    });

    canvas.addEventListener('click', (e: MouseEvent) => {
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
    });

    document.addEventListener('wheel', (e) => {
        const step = 3;
        if (e.deltaY < 0) {
            lineWidth += step;
        } else if (lineWidth >= step - 1) {
            lineWidth -= step;
        }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'z' && e.ctrlKey) {
            history.pop();
            const oldImage = history[history.length - 1];
            clearCanvas(ctx, canvas);
            if (oldImage) setImageToCanvas(ctx, oldImage);
        }
    });


    // function animate() {
    //     requestAnimationFrame(animate);
    // }
    // animate();
}

function getImageFromCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): ImageData {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function setImageToCanvas(ctx: CanvasRenderingContext2D, imgData: ImageData): void {
    ctx.putImageData(imgData, 0, 0);
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearHistory(history: ImageData[]) {
    history.length = 0;
}

function setPenState(ctx: CanvasRenderingContext2D, { lineWidth, lineCap, lineJoin }: PenState): void {
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
}

interface PenState {
    lineWidth: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
}

init();