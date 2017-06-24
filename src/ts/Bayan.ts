import { BayanKey } from "./BayanKey";
import { SoundFont } from "./SoundFont";
import { TimeController } from "./TimeController";
import { midiFileProsess } from "./midiFileProsess";

// shift = -1 + 3, 1 = B
// valid while shift in [0, 53]
let keyboardMap3: any =  {
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
    "=" : 33, "]" : 34,
    lowerBound: 0, upperBound: 53
};

// shift = 0 + 3, 1 = C
// valid while shift in [0, 42]
let keyboardMap4: any = {
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
    "=" : 44, "]" : 45,
    lowerBound: 0, upperBound: 42
};

let keyboardReverseMap3: Array<string> = [
    "1" , "Q", "A", "2Z", "W", "S", "3X", "E", "D",
    "4C", "R", "F", "5V", "T", "G", "6B", "Y", "H",
    "7N", "U", "J", "8M", "I", "K", "9,", "O", "L",
    "0.", "P", ";", "-/", "[", "'", "=",  "]"
];

let keyboardReverseMap4: Array<string> = [
    "1", "Q", "A", "Z", "2", "W", "S", "X",
    "3", "E", "D", "C", "4", "R", "F", "V",
    "5", "T", "G", "B", "6", "Y", "H", "N",
    "7", "U", "J", "M", "8", "I", "K", ",",
    "9", "O", "L", ".", "0", "P", ";", "/",
    "-", "[", "'", ",", "=",  "]"
];


class Bayan {
    private static _instance: Bayan = null;
    private keys = new Array<BayanKey>();
    public keybdMap: any;
    public keybdRmap: Array<string>;
    public shift: number;
    public soundfield: any;
    
    public static getInstance() : Bayan {
        if (Bayan._instance == null){
            Bayan._instance = new Bayan();
        }
        return Bayan._instance;
    }
    private constructor() {
        this.keybdMap = keyboardMap3;
        this.keybdRmap = keyboardReverseMap3;
        this.shift = 26; // 12 * 2 - 1 + 3
        this.soundfield = { low: 26, high: 60 };
    }

    public add(key: BayanKey): void {
        this.keys.push(key);
    }

    public getkey(keyCode: string): BayanKey {
        for (let i:number = 0; i < this.keys.length; i++) {
            if (this.keys[i].identify(keyCode))
                return this.keys[i];
        }
    }

    public initColor(): void {
        this.keys.forEach(element => {
            element.initColor();
        });
    }

    public setKeybd(keybdMap: string) {
        switch(keybdMap) {
            case "keyboardMap3":
                this.keybdMap = keyboardMap3;
                this.keybdRmap = keyboardReverseMap3;
                this.shift = 26;
                this.soundfield.low = 26;
                this.soundfield.high = 60;
                break;
            case "keyboardMap4":
                this.keybdMap = keyboardMap4;
                this.keybdRmap = keyboardReverseMap4;
                this.shift = 27;
                this.soundfield.low = 27;
                this.soundfield.high = 72;
                break;
            default:
                this.keybdMap = keyboardMap3;
                this.keybdRmap = keyboardReverseMap3;
                this.shift = 26;
                this.soundfield.low = 26;
                this.soundfield.high = 60;
        }
        this.initColor();
        midiFileProsess.loadMidiFile();
    }

    public getKeyNameByNote(note: number): string {
        while (note < this.soundfield.low) note += 12;
        while (note > this.soundfield.high) note -= 12;
        return this.keybdRmap[note - this.shift][0];
    }
}

export { Bayan };
