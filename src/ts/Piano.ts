import { SoundFont } from "./SoundFont";
import { ColorMap } from "./ColorMap";

class Piano {
    public key2HTMLid: any = {
        0: { white: true, id: 0 },
        1: { white: false, id: 0 },
        2: { white: true, id: 1 },
        3: { white: true, id: 2 },
        4: { white: false, id: 2 },
        5: { white: true, id: 3 },
        6: { white: false,  id: 3},
        7: { white: true, id: 4 },
        8: { white: true, id: 5 },
        9: { white: false, id: 5 },
        10: { white: true, id: 6 },
        11: { white: false,  id: 6}
    }
    public static _instance: Piano = null;
    private white2key = [0, 2, 3, 5, 7, 8, 10];
    private black2key = [1, -1, 4, 6, -1, 9, 11];
    public static getInstance(): Piano {
        if (Piano._instance === null)
            Piano._instance = new Piano();
        return Piano._instance;
    }
    public getHTMLidByKey(key: number): any {
        let group = Math.floor(key / 12);
        let maptab = this.key2HTMLid[key % 12];
        let newMaptab: any = {};
        newMaptab.white = maptab.white;
        newMaptab.id = maptab.id + group * 7;
        return newMaptab;
    }
    private constructor() {};
    private getKeyById(id: number, whiteKey: boolean) {
        if (whiteKey) {
            return this.white2key[id % 7] + Math.floor(id / 7) * 12;
        } else {
            return this.black2key[id % 7] + Math.floor(id / 7) * 12;
        }
    }
    public bindMouseEvent(div: any, id: number, whiteKey: boolean) {
        div.onmousedown = () => {
            SoundFont.getInstance().audio[this.getKeyById(id, whiteKey)].play();
            let cm = ColorMap.getInstance();
            div.style.backgroundColor = cm.getColor(this.getKeyById(id, whiteKey));
        }
        div.onmouseup = div.onmouseout = () => {
            let audio = SoundFont.getInstance().audio[this.getKeyById(id, whiteKey)];
            audio.pause();
            audio.currentTime = 0;
            div.style.cssText = "";
        };
    }
};

class PianoRoll {
    public static _instance: PianoRoll = null;
    private rectangles: any;
    private speed: number;
    public static getInstance(): PianoRoll {
        if (PianoRoll._instance === null)
            PianoRoll._instance = new PianoRoll();
        return PianoRoll._instance;
    }
    private constructor() {
        this.speed = 1;
        this.rectangles = new Array<any>();
        for (let i = 0; i < 88; i++) {
            this.rectangles[i] = {};
            this.rectangles[i].notekey = i;
            this.rectangles[i].box = new Array<any>();
            this.rectangles[i].hold = false;
            this.rectangles[i].x_axis = 4 * i;
            this.rectangles[i].width = 3;
        }
    };
    public setHold(notekey: number, hold: boolean):void {
        if (this.rectangles[notekey].hold === hold)
            return;
        this.rectangles[notekey].hold = hold;
        if (hold) {
            let pair = { begin: 0, end: -1 };
            this.rectangles[notekey].box.push(pair);
        } else {
            let arr = this.rectangles[notekey].box;
            arr[arr.length - 1].end = 0;
        }
    }
    public run(canvas: any): void {
        let cxt = canvas.getContext('2d');
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        this.rectangles.forEach(element => {
            while (element.box.length > 0 && element.box[0].end > canvas.height)
                element.box.splice(0, 1);
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
        });
    };
}

export { Piano };
export { PianoRoll };
