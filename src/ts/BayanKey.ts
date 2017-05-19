import { SoundFont } from "./SoundFont";
import { ColorMap } from "./ColorMap";

let keyboardMap3: any =  { // shift = -1 + 3, 1 = B
    "1" : 0,  "Q" : 1,  "A" : 2,  "Z" : 3,
    "2" : 3,  "W" : 4,  "S" : 5,  "X" : 6,
    "3" : 6,  "E" : 7,  "D" : 8,  "C" : 9,
    "4" : 9,  "R" : 10, "F" : 11, "V" : 12,
    "5" : 12, "T" : 13, "G" : 14, "B" : 15,
    "6" : 15, "Y" : 16, "H" : 17, "N" : 18,
    "7" : 18, "U" : 19, "J" : 20, "M" : 21,
    "8" : 21, "I" : 22, "K" : 23, "," : 24,
    "9" : 24, "O" : 25, "L" : 26, "." : 27,
    "0" : 27, "P" : 28, ";" : 29, "/" : 30,
    "-" : 30, "[" : 31, "'" : 32,
    "=" : 33, "]" : 34
}

let keyboardMap4: any = { // shift = 0 + 3, 1 = C
    "1" : 0,  "Q" : 1,  "A" : 2,  "Z" : 3,
    "2" : 4,  "W" : 5,  "S" : 6,  "X" : 7,
    "3" : 8,  "E" : 9,  "D" : 10, "C" : 11,
    "4" : 12, "R" : 13, "F" : 14, "V" : 15,
    "5" : 16, "T" : 17, "G" : 18, "B" : 19,
    "6" : 20, "Y" : 21, "H" : 22, "N" : 23,
    "7" : 24, "U" : 25, "J" : 26, "M" : 27,
    "8" : 28, "I" : 29, "K" : 30, "," : 31,
    "9" : 32, "O" : 33, "L" : 34, "." : 35,
    "0" : 36, "P" : 37, ";" : 38, "/" : 39,
    "-" : 40, "[" : 41, "'" : 42,
    "=" : 44, "]" : 45
}


class BayanKey {
    private keyName: string;
    private keyElement: any;
    private soundFont: SoundFont;
    private keybdMap: any;
    private playing: boolean;
    public shift: number;
    constructor(keyName: string, keyElement: any, sf: SoundFont) {
        this.keyName = keyName;
        this.keyElement = keyElement;
        this.soundFont = sf;
        this.keybdMap = keyboardMap3;
        this.shift = 26; // 12 * 2 - 1 + 3
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
        return this.keybdMap[this.keyName] + this.shift;
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

    private playSound(): void {
        this.soundFont.audio[this.getSoundKey()].play();
    }

    private stopSound(): void {
        // delay
        let audio: any = this.soundFont.audio[this.getSoundKey()];
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
