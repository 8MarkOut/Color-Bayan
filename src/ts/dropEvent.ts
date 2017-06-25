import { midiFileProsess } from "./midiFileProsess";
import { MainController } from "./mainController";
import { TimeController } from "./TimeController";

namespace dropEvent {
    // get the Data from MID file
    export let fileData: any;

    export let dropHandler = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        let files: any = e.dataTransfer.files;
        for(var i = 0, len = files.length; i < len; i++) {
            var f = files[i];
            readAsArrayBuffer(f);
        }
    }

    export let dragOverHandler = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dragEffect = 'copy';
    }

    let readAsArrayBuffer = (file: any) => { 
        var reader = new FileReader();    
        reader.onload = (e) => {
            fileData = reader.result.split('').map((v: any) => {
                return ('0'+ v.charCodeAt(0).toString(16)).slice(-2);
            });
            fileData = fileData.join("");
            midiFileProsess.setFileData(fileData);
            midiFileProsess.loadMidiFile();
            MainController.getInstance().finishPlay();
        }
        reader.readAsBinaryString(file);
    }

}


export { dropEvent }
