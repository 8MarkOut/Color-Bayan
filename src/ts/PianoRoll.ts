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
        this.speed = 1;
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
        // if reize the browser window size, call this function
        let alpha = 2.7;
        let wk = document.getElementsByClassName("white-key");
        let wsty = window.getComputedStyle(wk[0], null);
        let bk = document.getElementsByClassName("black-key");
        let bsty = window.getComputedStyle(bk[0], null);
        let bbsty = window.getComputedStyle(document.getElementById("black-box"), null);
        let wWidth = parseFloat(wsty.width);
        let bMinWidth = parseFloat(bsty.width); // parseFloat(bsty.minWidth);
        let bShift = parseFloat(bbsty.marginLeft);
        let bMaxWidth = bMinWidth + bShift;

        wWidth /= alpha;
        bMinWidth /= alpha;
        bMaxWidth /= alpha;
        bShift /= alpha;

        // console.log(wWidth);
        // console.log(bMinWidth);
        // console.log(bMaxWidth);
        // console.log(bShift);
        let wCount = 0;
        let bCount = 0;
        for (let i = 0; i < 88; i++) {
            if (this.rollBar[i].isWhite) {
                this.rollBar[i].width = wWidth;
                this.rollBar[i].x_axis = wWidth * wCount;
                wCount++;
            } else {
                this.rollBar[i].width = bMinWidth;
                this.rollBar[i].x_axis = bShift + bMaxWidth * bCount;
                bCount++;
                if (bCount == 1 || bCount == 4) {
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

// 使用div绘制动画有问题
// class PianoRoll {
//     public static _instance: PianoRoll = null;
//     private bars: any;
//     private speed: number;
//     private vwtop:number;
//     private vwbottom:number;
//     public static getInstance(): PianoRoll {
//         if (PianoRoll._instance === null)
//             PianoRoll._instance = new PianoRoll();
//         return PianoRoll._instance;
//     }
//     private constructor() {
//         this.speed = 1;
//         this.vwtop = 6; // 6vw
//         this.vwbottom = 30; // 30vw
//         this.bars = new Array<any>();
//         let bboxes: any = document.getElementsByClassName("black-key");
//         let wboxes: any = document.getElementsByClassName("white-key");
//         let bid = 0;
//         let wid = 0;
//         for (let i = 0; i < 88; i++) {
//             this.bars[i] = {};
//             let blackKey = [
//                 false, true, false, true,
//                 false, false, true, false,
//                 true, false, true, false];
//             this.bars[i].isblack = blackKey[(i+9) % 12];
//             this.bars[i].notekey = i;
//             if (this.bars[i].isblack) {
//                 if (bboxes[bid].style.cssText !== "") {
//                     // bboxes[bid].style.cssText === "visibility: hidden;"
//                     bboxes[1].cssText;
//                     bid++;
//                 }
//                 this.bars[i].container = bboxes[bid];
//                 bid++;
//             } else {
//                 if (wboxes[wid].style.cssText !== "") {
//                     wid++;
//                 }
//                 this.bars[i].container = wboxes[wid];
//                 wid++;
//             }
//             // console.log(this.bars[i].container);
//             this.bars[i].hold = false;
//         }
//         // this.run();
//     };

//     public setHold(notekey: number, hold: boolean):void {
//         if (this.bars[notekey].hold === hold)
//             return;
//         this.bars[notekey].hold = hold;
//         if (hold) {
//             let tempBar: any;
//             tempBar = document.createElement("div");
//             if (this.bars[notekey].isblack) {
//                 tempBar.setAttribute("class", "rollBar black");
//             } else {
//                 tempBar.setAttribute("class", "rollBar white");
//             }
//             tempBar.setAttribute("bottom", 0);
//             tempBar.setAttribute("top", -1);
//             this.bars[notekey].container.appendChild(tempBar);
//             // let pair = { height: 0, top: -1 };
//             // this.bars[notekey].heightAndTop.push(pair);
//         } else {
//             let children = this.bars[notekey].container.children;
//             let last = children[children.length - 1];
//             last.setAttribute("top", 0);
//             // let arr = this.bars[notekey].box;
//             // arr[arr.length - 1].end = 0;
//         }
//     }

//     public run(): void {
//         this.bars.forEach(element => {
//             // console.log(element);
//             let children: any;
//             while (true) {
//                 children = element.container.children;
//                 if (children.length <= 0) {
//                     break;
//                 }
//                 let top_y = parseFloat(children[0].getAttribute("top"));
//                 if (top_y > this.vwbottom) {
//                     element.container.removeChild(children[0]);
//                 } else {
//                     break;
//                 }
//             }
//             // children.forEach(e => {});
//             for (let i = 0; i < children.length; i++) {
//                 let e = children[i];
//                 let top_y = parseFloat(e.getAttribute("top"));
//                 let bottom_y = parseFloat(e.getAttribute("bottom"));
//                 bottom_y += this.speed;
//                 if (bottom_y > this.vwbottom) {
//                     bottom_y = this.vwbottom;
//                 }
//                 e.setAttribute("bottom", bottom_y);
//                 e.setAttribute("top", top_y)
//                 if (top_y !== -1) {
//                     top_y += this.speed;
//                     e.setAttribute("top", top_y);
//                 }
//                 e.style.cssText = "top:" + (this.vwtop + top_y) + "vw;";
//                 e.style.cssText += "height:" + (bottom_y - top_y) + "vw;";
//                 e.style.cssText += "background-color:" + ColorMap.getInstance().getColor(element.notekey) + ";";
//                 e.style.cssText += "z-index:" + (1 + i) + ";";
//             }
//         });
//     };
// }

export { PianoRoll };
