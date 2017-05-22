import { SoundFont } from "./SoundFont";
import { ColorMap } from "./ColorMap";
import { Bayan } from "./Bayan";

class BayanKey {
    private keyName: string;
    private keyElement: any;

    private playing: boolean;
    constructor(keyName: string, keyElement: any, sf: SoundFont) {
        this.keyName = keyName;
        this.keyElement = keyElement;
        this.playing = false;
    }

    public initColor(): void {
        if (this.keyElement !== undefined) {
            if (this.isBlackKey()) {
                this.keyElement.setAttribute("class", "key deep-gray");
            } else {
                this.keyElement.setAttribute("class", "key gray");
            }
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
        let cm = ColorMap.getInstance();
        this.keyElement.style.backgroundColor = cm.getColor(this.getSoundKey());
    }

    private changeBackColor(): void {
        this.keyElement.style.cssText = "";
    }

    private getSoundKey(): number {
        let bayan = Bayan.getInstance();
        let rVal: number = bayan.keybdMap[this.keyName] + bayan.shift;
        return SoundFont.normalizeKey(rVal);
    }

    public keyDown(): void {
        if (this.playing === false) {
            this.playing = true;
            this.changeColor();
            this.playSound();
            this.keyElement.getElementsByClassName("display")[0].innerHTML =
                SoundFont.key2note(this.getSoundKey());
        }
    }

    public keyUp(): void {
        this.playing = false;
        this.changeBackColor();
        this.stopSound();
        this.keyElement.getElementsByClassName("display")[0].innerHTML = "";
    }

    public playSound(): void {
        Bayan.getInstance().soundFont.audio[this.getSoundKey()].play();
    }

    public stopSound(): void {
        // delay
        let audio: any = Bayan.getInstance().soundFont.audio[this.getSoundKey()];
        audio.pause();
        audio.currentTime = 0;
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
