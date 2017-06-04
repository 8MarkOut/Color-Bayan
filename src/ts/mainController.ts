import { TimeController } from "./TimeController";
import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";
import { soundEvent } from "./soundEvent";
import { MIDIParser } from "./MIDIParser";

enum KeyBoardStatus {
    Up,
    Down
}

class KeyEvent {
    public key: Array<string>;
    public keyStatus: Array<KeyBoardStatus>;
    constructor() {
        this.key = new Array();
        this.keyStatus = new Array();
    }
    public push(key: string, keyStatus: KeyBoardStatus) {
        this.key.push(key);
        this.keyStatus.push(keyStatus);
    }
}

let sequence = MIDIParser.test();

class MainController {
    private playEvent: any;
    public playing: boolean;
    private static _instance: MainController = null;
    private constructor() {
        this.playing = false;
    }
    public static getInstance() : MainController {
        if (MainController._instance == null){
            MainController._instance = new MainController();
        }
        return MainController._instance;
    }
    public loadSequence(seq: Array<KeyEvent>): void {
        sequence = seq;
    }
    public autoPlay() {
        let timeControl = TimeController.getInstance();
        if (timeControl.getTime() > sequence.length) {
            timeControl.finish();
            MainController.getInstance().stopPlay();
        } else {
            timeControl.start();
            let time: number = timeControl.getTime();
            if (sequence[time] !== undefined) {
                for (let i: number = 0; i < sequence[time].key.length; i++) {
                    if (sequence[time].keyStatus[i] === KeyBoardStatus.Up) {
                        Bayan.getInstance().getkey(sequence[time].key[i]).keyUp();
                        soundEvent.stopSound(sequence[time].key[i]);
                    }
                    if (sequence[time].keyStatus[i] === KeyBoardStatus.Down) {
                        Bayan.getInstance().getkey(sequence[time].key[i]).keyDown();
                        soundEvent.playSound(sequence[time].key[i]);
                    }
                }
            }
        }
    }

    public play() {
        let that = this;
        this.playing = true;
        SoundFont.getInstance().resetlock(3);
        this.playEvent = setInterval(that.autoPlay, 50);
    }

    public stopPlay() {
        TimeController.getInstance().stop();
        this.playing = false;
        SoundFont.getInstance().resetlock(1);
        clearInterval(this.playEvent);
    }
}

export { KeyBoardStatus};
export { KeyEvent };
export { MainController };
