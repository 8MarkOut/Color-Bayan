import { NoteAction, MIDIParser } from "./midiparser";
import { Bayan } from "./bayan";
import { Piano } from "./piano";

class TimeController {
    private time: number;
    private timeout: any;
    private static instance_: TimeController = null;
    public static getInstance() : TimeController {
        if (TimeController.instance_ == null){
            TimeController.instance_ = new TimeController();
        }
        return TimeController.instance_;
    }
    constructor() { this.time = 0; }
    public reset(): void { this.time = 0; }
    public getTime(): number { return this.time; }
    public start(): void {
        let that = this;
        this.timeout = self.setInterval(that.time++, 10000000000);
    }

    public stop(): void { window.clearInterval(this.timeout); }
    public finish(): void {
        this.stop();
        this.reset();
    }
}

// let sequence = MIDIParser.test();
let sequence = null;

class Player {
    private playEvent: any;
    public playing: boolean;
    private static instance_: Player = null;
    public init() {
        let playButton = document.getElementById("realButton");
        playButton.onclick = () => {
            let playArrow = document.getElementById("playArrow");
            if (!this.playing) {
                this.play();
                playArrow.innerText = "pause";
            } else {
                this.stopPlay();
                playArrow.innerHTML = "play_arrow";
            }
        }
    }
    
    private constructor() {
        this.playing = false;
    }
    public static getInstance() : Player {
        if (Player.instance_ == null){
            Player.instance_ = new Player();
        }
        return Player.instance_;
    }
    public loadSequence(seq: Array<NoteAction>): void {
        sequence = seq;
    }
    public autoPlay() {
        let playPro = document.getElementById("playPro");
        let timeControl = TimeController.getInstance();
        playPro.style.width = Math.floor(timeControl.getTime() / sequence.length * 100).toString() + "%";
        if (timeControl.getTime() > sequence.length) {
            Player.getInstance().finishPlay();
        } else {
            timeControl.start();
            let time: number = timeControl.getTime();
            if (sequence[time] !== undefined) {
                for (let i: number = 0; i < sequence[time].notes.length; i++) {
                    if (sequence[time].ons[i]) {
                        Bayan.getInstance().press(sequence[time].notes[i]);
                    } else {
                        Bayan.getInstance().release(sequence[time].notes[i]);
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
        Bayan.getInstance().releaseAll();
    }

    public finishPlay() {
        TimeController.getInstance().finish();
        let playButton = document.getElementById("playButton");
        if (playButton.className.indexOf("active") !== -1)
            document.getElementById("realButton").click();
    }
}

export { TimeController, Player };
