import { TimeController } from "./TimeController";
import { Bayan } from "./Bayan";
import { soundEvent } from "./soundEvent";

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
    public autoPlay() {
        let timeControl = TimeController.getInstance();
        if (timeControl.getTime() > soundOrder.length) {
            timeControl.finish();
            MainController.getInstance().stopPlay();
        } else {
            timeControl.start();
            let time: number = timeControl.getTime();
            if (soundOrder[time] !== undefined) {
                for (let i: number = 0; i < soundOrder[time].key.length; i++) {
                    if (soundOrder[time].keyStatus[i] === keyBoardStatus.Up) {
                        Bayan.getInstance().getkey(soundOrder[time].key[i]).keyUp();
                        soundEvent.stopSound(soundOrder[time].key[i]);
                    }
                    if (soundOrder[time].keyStatus[i] === keyBoardStatus.Down) {
                        Bayan.getInstance().getkey(soundOrder[time].key[i]).keyDown();
                        soundEvent.playSound(soundOrder[time].key[i]);
                    }
                }
            }
        }
    }

    public play() {
        let that = this;
        this.playing = true;
        this.playEvent = setInterval(that.autoPlay, 50);
    }

    public stopPlay() {
        TimeController.getInstance().stop();
        this.playing = false;
        clearInterval(this.playEvent);
    }
}

export { MainController };
