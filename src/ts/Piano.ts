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
    public initHTML() {
        let piano: any = document.getElementById("Piano");
        let box: any = document.createElement("div");
        box.setAttribute("class", "piano-box");

        let white_box: any = document.createElement("div");
        white_box.setAttribute("class", "white-box");
        for (let j: number = 0; j < 52; j++) {
            let temp: any = document.createElement("div");
            temp.setAttribute("class", "white-key");
            white_box.appendChild(temp);
            temp.onmousedown = () => {
                SoundFont.getInstance().audio[this.getKeyById(j, true)].play();
                let cm = ColorMap.getInstance();
                temp.style.backgroundColor = cm.getColor(this.getKeyById(j, true));
            }
            temp.onmouseup = () => {
                let audio = SoundFont.getInstance().audio[this.getKeyById(j, true)];
                audio.pause();
                audio.currentTime = 0;
                temp.style.cssText = "";
            };
            temp.onmouseout = () => {
                let audio = SoundFont.getInstance().audio[this.getKeyById(j, true)];
                audio.pause();
                audio.currentTime = 0;
                temp.style.cssText = "";
            };
        }

        let black_box: any = document.createElement("div");
        black_box.setAttribute("class", "black-box");
        let hidden = [ false, false, true, false, false, false, true];
        for (let j: number =0; j < 51; j++) {
            let temp: any = document.createElement("div");
            temp.setAttribute("class", "black-key");
            if (hidden[(j + 5) % 7]) {
                temp.style.visibility = "hidden";
            } else {
                temp.onmousedown = () => {
                    SoundFont.getInstance().audio[this.getKeyById(j, false)].play();
                    let cm = ColorMap.getInstance();
                    temp.style.backgroundColor = cm.getColor(this.getKeyById(j, false));
                }
                temp.onmouseup = () => {
                    let audio = SoundFont.getInstance().audio[this.getKeyById(j, false)];
                    audio.pause();
                    audio.currentTime = 0;
                    temp.style.cssText = "";
                };
                temp.onmouseout = () => {
                    let audio = SoundFont.getInstance().audio[this.getKeyById(j, false)];
                    audio.pause();
                    audio.currentTime = 0;
                    temp.style.cssText = "";
                };
            }
            black_box.appendChild(temp);
        }
        
        box.appendChild(white_box);
        box.appendChild(black_box);
        piano.appendChild(box);
    }
};

export { Piano };
