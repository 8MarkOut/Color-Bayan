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

export { Piano };
