import acoustic_grand_piano from "../lib/acoustic_grand_piano-mp3";

// class SoundField {
//     public low: number;
//     public high: number;
// }

class SoundFont {
    private instrument: string;
    private note: Array<number>;
    private loop: boolean;
    // private field: SoundField;
    public audio : any;
    constructor(instrument: string) {
        this.audio = new Array<any>();
        this.changeInstrument(instrument);
    }
    private getSoundJson(instrument: string): any {
        switch (instrument) {
            case "acoustic_grand_piano":
                return acoustic_grand_piano;
            default:
                return acoustic_grand_piano;
        }
    }
    public key2note(key: number): string {
        if (key < 0 || key >= 88) return "A0";
        key += 9;
        let number2key: Array<string> = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return number2key[key % 12] + Math.floor(key / 12);
    }
    public note2key(note: string): number {
        let note1: string = note.substring(0, note.length - 1);
        let group: number = parseInt(note[note.length - 1]);
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
        return group * 12 + scale - 9;
    }
    // public setSoundField(low: number, high: number) {
    //     this.field.low = low;
    //     this.field.high = high;
    // }
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
            this.audio[i] = new Audio(this.getSoundJson(this.instrument)[this.key2note(i)]);
            this.audio[i].loop = this.loop;
        }
    }
}

export { SoundFont };
