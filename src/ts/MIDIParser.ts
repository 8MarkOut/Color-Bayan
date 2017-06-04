import { KeyEvent } from "./mainController";
import { MainController } from "./mainController";
import { KeyBoardStatus} from "./mainController";

import { Bayan } from "./Bayan";

class HexTextFileReader {
    private data: string;
    private fp: number;

    public constructor(data: string) {
        this.data = data;
        this.fp = 0;
    }
    
    public readByte(n: number): string {
        let rval = this.data.substr(this.fp, n * 2);
        this.fp += n * 2;
        return rval;
    }

    public readInterval(): number {
        let interval = 0;
        let byte: number;
        while ((byte = parseInt(this.readByte(1), 16)) & 0x80) {
            interval = (interval << 7) + (byte & 0x7f);
        }
        interval = (interval << 7) + byte;
        return interval;
    }
}

class MIDIParser {
    public static test(): Array<KeyEvent> {
        let seq: Array<KeyEvent> = new Array<KeyEvent>();
        seq[10] = new KeyEvent();
        seq[10].push(".", KeyBoardStatus.Down);
        seq[20] = new KeyEvent();
        seq[20].push(".", KeyBoardStatus.Up);
        seq[20].push(",", KeyBoardStatus.Down);
        seq[30] = new KeyEvent();
        seq[30].push(",", KeyBoardStatus.Up);
        seq[30].push("I", KeyBoardStatus.Down);
        seq[40] = new KeyEvent();
        seq[40].push("I", KeyBoardStatus.Up);
        seq[40].push("J", KeyBoardStatus.Down);
        seq[50] = new KeyEvent();
        seq[50].push("J", KeyBoardStatus.Up);
        return seq;
    }

    // private track: Array<string>;
    // private MidiInfo: any;
    // private trackHeader: string;
    private lastEvent: string;
    private seq: Array<KeyEvent>;

    public createKeyEvents(data: string): Array<KeyEvent> {
        this.seq = new Array<KeyEvent>();
        let read: string;
        let n_byte: number;

        let fileReader = new HexTextFileReader(data);
        
        // 4 bytes, check ASCII text "MThd"
        read = fileReader.readByte(4);
        if (read.substr(0, 8) !== "4d546864") {
            console.log("not a MIDI file");
            return null;
        }

        // 4 bytes, determine to length of the rest header
        // It should be "00 00 00 06"
        read = fileReader.readByte(4);
        n_byte = parseInt(read, 16);
        // console.log(n_byte);

        read = fileReader.readByte(n_byte);
        // 6 bytes, "ff ff nn nn dd dd"
        // "ff ff": midi format
        //      "00 00": single track
        //      "00 01": multiple track, sync
        //      "00 02": multiple track, async
        // "nn nn": the number of tracks
        //      n + 1, total tracks (n) plus a global track
        let n_track = parseInt(read.substr(4, 4), 16);
        console.log("total tracks: " + n_track);
        // "dd dd": the ticks of a quarter note
        let n_quarter_ticks = parseInt(read.substr(8, 4), 16);
        console.log("the ticks of a quarter note: " + n_quarter_ticks);

        // deal with tracks
        for (let i = 0; i < n_track; i++) {
            // 4 bytes, check ASCII text "MTrk"
            read = fileReader.readByte(4);
            if (read.substr(0, 8) !== "4d54726b") {
                console.log("sync error with track");
                return null;
            }
            // 4 bytes, indicating the total bytes of the track
            read = fileReader.readByte(4);
            n_byte = parseInt(read, 16);
            console.log("this track has " + n_byte + " bytes.");
            read = fileReader.readByte(n_byte);
            this.addTrack(read);
        }
        console.log(this.seq);
        return this.seq;
    }

    private noteAction(time: number, note: number, on: boolean) {
        if (this.seq[time] == null) {
            this.seq[time] = new KeyEvent();
        }
        let keybdKey = Bayan.getInstance().getKeyNameByNote(note - 9);
        this.seq[time].push(keybdKey, on ? KeyBoardStatus.Down : KeyBoardStatus.Up);
    }

    private addTrack(trInfo: string):void {
        let fileReader = new HexTextFileReader(trInfo);

        // format:
        //  basic events format: 8b'1xxx_xxxx
        //  note 0x00-0x7F, using previous activating basic format

        let timeLine = 10;
        let alpha = 50; // time ticks scaling
        let n_byte: number;
        while (true) {
            let interval = fileReader.readInterval();
            timeLine += interval;
            let events = fileReader.readByte(1);
            let note: number; // 音符
            let velocity: number // 力度
            let info: string;
            if (parseInt(events[0], 16) & 0x8) { // basic events
                switch(events[0]) { // events[1] is channel, we ignored
                    case "8": // 松开音符
                    case "9": // 按下音符
                    case "a": // 触后音符
                        this.lastEvent = events[0];
                        note = parseInt(fileReader.readByte(1), 16);
                        velocity = parseInt(fileReader.readByte(1), 16);
                        let ticks = Math.floor(timeLine / alpha);
                        if (this.lastEvent === "8" ||
                        this.lastEvent === "9" && velocity === 0 ) {
                            this.noteAction(ticks, note, false);
                        } else {
                            this.noteAction(ticks, note, true);
                        }
                        break;
                    case "b": // 控制器
                        // 控制器号码:0x00-0x7F
                        // 控制器参数:0x00-0x7F
                        fileReader.readByte(2);
                        break;
                    case "c": // 改变乐器
                        // 乐器号码：0x00-0x7F
                        fileReader.readByte(1);
                        break;
                    case "d": // 触后通道
                        // 值:0x00-0x7F
                        fileReader.readByte(1);
                        break;
                    case "e": // 滑音
                        // 音高(Pitch)低位:Pitch mod 128
                        // 音高高位:Pitch div 128
                        fileReader.readByte(2);
                        break;
                    case "f": 
                        if (events[1] == "0") { // 系统码
                            n_byte = parseInt(fileReader.readByte(1), 16);
                            fileReader.readByte(n_byte);
                        } else if (events[1] == "f") { // 其他格式
                            info = fileReader.readByte(1);
                            n_byte = parseInt(fileReader.readByte(1), 16);
                            if (info == "2f") {
                                return;
                            } else {
                                fileReader.readByte(n_byte);
                            }
                        } else {
                            console.log("invalid event format: " + events);
                        }
                }
            } else {
                note = parseInt(fileReader.readByte(1), 16);
                velocity = parseInt(fileReader.readByte(1), 16);
                let ticks = Math.floor(timeLine / alpha);
                if (this.lastEvent === "8" ||
                this.lastEvent === "9" && velocity === 0 ) {
                    this.noteAction(ticks, note, false);
                } else {
                    this.noteAction(ticks, note, true);
                }
            }
        }
    }
};

export { MIDIParser };
