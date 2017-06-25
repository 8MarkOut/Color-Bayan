import { ColorMap } from "./ColorMap";
import { BayanKey } from "./BayanKey";

class PianoRoll {
    public static _instance: PianoRoll = null;
    private rollBar: any;
    private speed: number;
    public static getInstance(): PianoRoll {
        if (PianoRoll._instance === null)
            PianoRoll._instance = new PianoRoll();
        return PianoRoll._instance;
    }
    private constructor() {
        this.speed = 6;
        this.rollBar = new Array<any>();
        for (let i = 0; i < 88; i++) {
            this.rollBar[i] = {};
            this.rollBar[i].isWhite = BayanKey.isWhiteKey(i);
            this.rollBar[i].notekey = i;
            this.rollBar[i].box = new Array<any>();
            this.rollBar[i].hold = false;
        }
        this.resize();
    };

    public resize(): void {
        // if reize the browser window, call this function
        let wk = document.getElementsByClassName("white-key");
        let wsty = window.getComputedStyle(wk[0], null);
        let bk = document.getElementsByClassName("black-key");
        let bsty = window.getComputedStyle(bk[0], null);
        let bbsty = window.getComputedStyle(document.getElementById("black-box"), null);
        let wWidth = parseFloat(wsty.width);
        let bMinWidth = parseFloat(bsty.width); // parseFloat(bsty.minWidth);
        let bShift = parseFloat(bbsty.marginLeft);
        let bMaxWidth = bMinWidth + bShift;

        let wCount = 0;
        let bCount = 0;
        for (let i = 0; i < 88; i++) {
            if (this.rollBar[i].isWhite) {
                this.rollBar[i].width = wWidth;
                this.rollBar[i].x_axis = wWidth * wCount;
                wCount++;
            } else {
                this.rollBar[i].width = bMinWidth;
                this.rollBar[i].x_axis = bShift + wWidth * bCount;
                bCount++;
                if (bCount % 7 == 1 || bCount % 7 == 4) {
                    bCount++;
                }
            }
        }
    }

    public setHold(notekey: number, hold: boolean):void {
        if (this.rollBar[notekey].hold === hold)
            return;
        this.rollBar[notekey].hold = hold;
        if (hold) {
            let pair = { begin: 0, end: -1 };
            this.rollBar[notekey].box.push(pair);
        } else {
            let arr = this.rollBar[notekey].box;
            arr[arr.length - 1].end = 0;
        }
    }
    public run(canvas: any): void {
        let cxt = canvas.getContext('2d');
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        this.rollBar.forEach(element => {
            while (element.box.length > 0 && element.box[0].end > canvas.height)
                element.box.splice(0, 1);
            if (element.isWhite) {
                element.box.forEach(e => {
                    e.begin += this.speed;
                    cxt.fillStyle = ColorMap.getInstance().getColor(element.notekey);
                    if (e.end === -1) {
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin); 
                    } else {
                        e.end += this.speed;
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin - e.end); 
                    }
                });
            }
        });
        this.rollBar.forEach(element => {
            if (!element.isWhite) {
                element.box.forEach(e => {
                    e.begin += this.speed;
                    cxt.fillStyle = ColorMap.getInstance().getColor(element.notekey);
                    if (e.end === -1) {
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin); 
                    } else {
                        e.end += this.speed;
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin - e.end); 
                    }
                });
            }
        });
    };
}

export { PianoRoll };
