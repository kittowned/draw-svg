function run(): void {
    /**
     * Elements
     */
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    const canvasHistory = document.querySelector('canvas-history') as CanvasHistory;
    const clearBtn = document.querySelector('.clearBtn') as HTMLButtonElement;
    clearBtn.addEventListener('click', () => {
        canvasHistory.clearHistory();
        clearCanvas(ctx, canvas)
    });

    /**
     * Initial state
     */
    const penState: PenState = { lineWidth: 1.0, lineCap: "round", lineJoin: "round" };
    let canDraw: boolean = false;

    /**
     *  Resize handler
     */
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
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
        canDraw = true;
        const x = e.offsetX;
        const y = e.offsetY;
        setPenState(ctx, penState);
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineTo(x, y);
    });

    /** 
     * Mouse move event, only tracked inside canvas, continue drawing
     */
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        const x = e.offsetX;
        const y = e.offsetY;
        if (canDraw) {
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
        canvasHistory.addHistory(getImageFromCanvas(ctx, canvas));
    });

    /** 
     * Scroll wheel event, increase/decrease line width
     */
    document.addEventListener('wheel', (e) => {
        const step = 3;
        if (e.deltaY < 0) {
            penState.lineWidth += step;
        } else if (penState.lineWidth >= step - 1) {
            penState.lineWidth -= step;
        }
    });

    /**
     * Keyboard event, ctrl + z, go back in history
     */
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'z' && e.ctrlKey) {
            canvasHistory.back();
            const oldImage = canvasHistory.getCurrentImage();
            clearCanvas(ctx, canvas);
            if (oldImage) setImageToCanvas(ctx, oldImage);
        }
    });

    /**
     * Keyboard event, ctrl + y, go forwards in history
     */
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'y' && e.ctrlKey) {
            canvasHistory.forward();
            const oldImage = canvasHistory.getCurrentImage();
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

class CanvasHistory extends HTMLElement {
    static get observedAttributes() {
        return ['update'];
    }

    private _history: ImageData[] = [];
    private _historyPointer: number = -1;

    addHistory(image: ImageData) {
        this._history.push(image);
        this.forward();
    }

    back() {
        if (this._historyPointer < 0) return;
        this._historyPointer--;
    }

    forward() {
        if (this._historyPointer >= this._history.length - 1) return;
        this._historyPointer++;
    }

    getCurrentImage(): ImageData {
        return this._history[this._historyPointer];
    }

    clearHistory() {
        this._history.length = 0;
        this._historyPointer = -1;
    }

    resetHistory() {

    }

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const style = document.createElement('style');

        style.textContent = ``;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    attributeChangedCallback() {
        console.log('attributeChangedCallback called');
    }
}

customElements.define('canvas-history', CanvasHistory);

run();
