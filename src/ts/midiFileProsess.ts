import { MIDIParser } from "./MIDIParser";
import { MainController } from "./MainController";

namespace midiFileProsess {
    let fileData: string;
    let midiparse = new MIDIParser();

    export let setFileData = (file: string) => {
        fileData = file;
    }

    export let loadMidiFile = () => {
        let seq = midiparse.createKeyEvents(fileData);
        MainController.getInstance().loadSequence(seq);
    }
}

export { midiFileProsess };
