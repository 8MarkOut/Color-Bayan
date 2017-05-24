import acoustic_grand_piano from "../lib/acoustic_grand_piano-mp3";
import synth_drum from "../lib/synth_drum-mp3.js";

class SoundFont {
    private instrument: string;
    private note: Array<number>;
    private loop: boolean;
    public audio : any;
    private static _instance: SoundFont = null;
    public static getInstance(): SoundFont {
        if (SoundFont._instance === null)
            SoundFont._instance = new SoundFont();
        return SoundFont._instance;
    }
    private constructor() {
        this.audio = new Array<any>();
        this.changeInstrument("acoustic_grand_piano");
    }
    private getSoundJson(instrument: string): any {
        switch (instrument) {
            case "acoustic_grand_piano":
                return acoustic_grand_piano;
            case "synth_drum":
                return synth_drum;
            default:
                return acoustic_grand_piano;
        }
    }
    public static normalizeKey(key: number): number {
        if (key < 0) key = 0;
        if (key > 87) key = 87;
        return key;
    }
    public static key2note(key: number): string {
        key = SoundFont.normalizeKey(key);
        key += 9;
        let number2key: Array<string> = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return number2key[key % 12] + Math.floor(key / 12);
    }
    public static note2key(note: string): number {
        let re = /[A-G](b?)/;
        let result = re.exec(note);
        let note1 = re.exec(note)[0];
        let note2 = note.substring(note1.length, note.length);
        let group: number = parseInt(note2);
        let scale: number;
        switch(note1) {
            case "C":  scale = 0; break;
            case "Db": scale = 1; break;
            case "D":  scale = 2; break;
            case "Eb": scale = 3; break;
            case "E":  scale = 4; break;
            case "F":  scale = 5; break;
            case "Gb": scale = 6; break;
            case "G":  scale = 7; break;
            case "Ab": scale = 8; break;
            case "A":  scale = 9; break;
            case "Bb": scale = 10; break;
            case "B":  scale = 11; break;
            default:   scale = 0;
        }
        return SoundFont.normalizeKey(group * 12 + scale - 9);
    }
    public changeInstrument(instrument: string): void {
        this.instrument = instrument;
        switch(instrument) {
            case "accordion":
            case "violin":
                this.loop = true;
            default:
                this.loop = false;
        }
        for (let i = 0; i < 88; i++) {
            this.audio[i] = new Audio(this.getSoundJson(this.instrument)[SoundFont.key2note(i)]);
            this.audio[i].loop = this.loop;
        }
    }
}

export { SoundFont };
