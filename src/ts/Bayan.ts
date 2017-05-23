import { BayanKey } from "./BayanKey";
import { SoundFont } from "./SoundFont";
import { TimeController } from "./TimeController";

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
}

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
    lowerBOund: 0, upperBound: 42
}

enum keyBoardStatus {
    Up,
    Down
}

class keyEvent {
    public key: Array<string>;
    public keyStatus: Array<keyBoardStatus>;
    constructor() {
        this.key = new Array();
        this.keyStatus = new Array();
    }
    public push(key: string, keyStatus: keyBoardStatus) {
        this.key.push(key);
        this.keyStatus.push(keyStatus);
    }
}

let soundOrder: Array<keyEvent> = new Array<keyEvent>();
soundOrder[10] = new keyEvent();
soundOrder[10].push(".", keyBoardStatus.Down);
soundOrder[20] = new keyEvent();
soundOrder[20].push(".", keyBoardStatus.Up);
soundOrder[20].push(",", keyBoardStatus.Down);
soundOrder[30] = new keyEvent();
soundOrder[30].push(",", keyBoardStatus.Up);
soundOrder[30].push("I", keyBoardStatus.Down);
soundOrder[40] = new keyEvent();
soundOrder[40].push("I", keyBoardStatus.Up);
soundOrder[40].push("J", keyBoardStatus.Down);
soundOrder[50] = new keyEvent();
soundOrder[50].push("J", keyBoardStatus.Up);

class Bayan {
    private static _instance: Bayan = null;
    private keys = new Array<BayanKey>();
    public soundFont: SoundFont;
    public keybdMap: any;
    public shift: number;
    public playing: boolean;
    private playEvent: any;
    public static getInstance() : Bayan {
        if (Bayan._instance == null){
            Bayan._instance = new Bayan();
        }
        return Bayan._instance;
    }
    private constructor() {
        this.soundFont = null;
        this.keybdMap = keyboardMap3;
        this.shift = 26; // 12 * 2 - 1 + 3
        this.playing = false;
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
                this.shift = 26;
                break;
            case "keyboardMap4":
                this.keybdMap = keyboardMap4;
                this.shift = 27;
                break;
            default:
                this.keybdMap = keyboardMap3;
                this.shift = 26;
        }
        this.initColor();
    }
    public autoPlay() {
        let timeControl = TimeController.getInstance();
        if (timeControl.getTime() > soundOrder.length) {
            timeControl.finish();
            Bayan.getInstance().stopPlay();
        } else {
            timeControl.start();
            let time: number = timeControl.getTime();
            if (soundOrder[time] !== undefined) {
                for (let i: number = 0; i < soundOrder[time].key.length; i++) {
                    if (soundOrder[time].keyStatus[i] === keyBoardStatus.Up)
                        Bayan.getInstance().getkey(soundOrder[time].key[i]).keyUp();
                    if (soundOrder[time].keyStatus[i] === keyBoardStatus.Down)
                        Bayan.getInstance().getkey(soundOrder[time].key[i]).keyDown();
                }
            }
        }
    }

    public play() {
        Bayan.getInstance().playing = true;
        this.playEvent = setInterval(Bayan.getInstance().autoPlay, 50);
    }

    public stopPlay() {
        TimeController.getInstance().stop();
        this.playing = false;
        clearInterval(this.playEvent);
    }
}

export { Bayan };
