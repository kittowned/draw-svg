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
    let historyPointer: number = 0;
    const history: ImageData[] = [];
    // const colors: string[] = ['red', 'green', 'blue'];

    /** Resize handler */
    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas() {
        const image = getImageFromCanvas(ctx, canvas);
        canvas.width = window.innerWidth / 1.5;
        canvas.height = window.innerHeight / 1.1;
        ctx.putImageData(image, 0, 0);
    }

    resizeCanvas();

    /** 
     * Mouse down event, begin drawing
    */
    document.addEventListener('mousedown', (e: MouseEvent) => {
        canDraw = true;
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.moveTo(x, y);
        ctx.beginPath();
    });

    /** 
     * Mouse move event, only tracked inside canvas, continue drawing
    */
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

    /** 
     * Mouse up event, finish drawing and update history
    */
    document.addEventListener('mouseup', () => {
        canDraw = false
        const newImage = getImageFromCanvas(ctx, canvas);
        history.push(newImage);
    });

    /**
     * Mouse click event, triggers after mouseup. Needed to draw a dot when clicking but not moving
     */
    canvas.addEventListener('click', (e: MouseEvent) => {
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
    });

    /** 
     * Scroll wheel event, increase/decrease line width
    */
    document.addEventListener('wheel', (e) => {
        const step = 3;
        if (e.deltaY < 0) {
            lineWidth += step;
        } else if (lineWidth >= step - 1) {
            lineWidth -= step;
        }
    });

    /**
     * Keyboard event, ctrl + z, go back in history
     */
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'z' && e.ctrlKey) {
            history.pop();
            const oldImage = history[history.length - 1];
            clearCanvas(ctx, canvas);
            if (oldImage) setImageToCanvas(ctx, oldImage);
        }
    });

    /**
     * Keyboard event, ctrl + y, go forwards in history
     */
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'y' && e.ctrlKey) {
            history.pop();
            const oldImage = history[history.length - 1];
            clearCanvas(ctx, canvas);
            if (oldImage) setImageToCanvas(ctx, oldImage);
        }
    });
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