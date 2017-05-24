import { SoundFont } from "./SoundFont";
import { ColorMap } from "./ColorMap";

class Piano {
    public static _instance: Piano = null;
    private white2key = [0, 2, 3, 5, 7, 8, 10];
    private black2key = [1, -1, 4, 6, -1, 9, 11];
    public static getInstance(): Piano {
        if (Piano._instance === null)
            Piano._instance = new Piano();
        return Piano._instance;
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
