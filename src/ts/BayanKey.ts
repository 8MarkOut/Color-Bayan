import { SoundFont } from "./SoundFont";
import { ColorMap } from "./ColorMap";
import { Bayan } from "./Bayan";
import { Piano } from "./Piano";

class BayanKey {
    private keyName: string;
    private keyElement: any;

    private playing: boolean;
    constructor(keyName: string, keyElement: any) {

        this.keyName = keyName;
        this.keyElement = keyElement;
    }

    public initColor(): void {
        if (this.keyElement !== undefined) {
            if (this.isBlackKey())
                this.keyElement.setAttribute("class", "key deep-gray");
            else
                this.keyElement.setAttribute("class", "key gray");
        }
    }

    public getKeyChar(): string {
        return this.keyName;
    }
    public getKeyElement(): any {
        return this.keyElement;
    }
    public identify(keyName: string): boolean {
        return this.keyName === keyName;
    }

    private changeColor(): void {
        let color = ColorMap.getInstance().getColor(this.getSoundKey());
        this.keyElement.style.backgroundColor = color;
        let piano = Piano.getInstance();
        let elementInfo = piano.getHTMLidByKey(this.getSoundKey());
        if (elementInfo.white) {
            let temp: any = document.getElementById("white-box").childNodes[elementInfo.id];
            temp.style.backgroundColor = color;
        } else {
            let temp: any = document.getElementById("white-box").childNodes[elementInfo.id];
            temp.style.backgroundColor = color;
        }
    }

    private changeBackColor(): void {
        this.keyElement.style.cssText = "";
        let piano = Piano.getInstance();
        let elementInfo = piano.getHTMLidByKey(this.getSoundKey());
        if (elementInfo.white) {
            let temp: any = document.getElementById("white-box").childNodes[elementInfo.id];
            temp.style.cssText = "";
        } else {
            let temp: any = document.getElementById("black-box").childNodes[elementInfo.id];
            temp.style.cssText = "";
        }
    }

    private getSoundKey(): number {
        let bayan = Bayan.getInstance();
        let rVal: number = bayan.keybdMap[this.keyName] + bayan.shift;
        return SoundFont.normalizeKey(rVal); 
    }

    public keyDown(): void {
        this.changeColor();
        this.keyElement.getElementsByClassName("display")[0].innerHTML =
            SoundFont.key2note(this.getSoundKey());
    }

    public keyUp(): void {
        this.changeBackColor();
        this.keyElement.getElementsByClassName("display")[0].innerHTML = "";
    }

    private isBlackKey(): boolean {
        let blackkey = [
            false, true, false, true, false,
            false, true, false, true, false,
            true, false
        ];
        return blackkey[(this.getSoundKey() + 9) % 12];
    }
}

export { BayanKey };
