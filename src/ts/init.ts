import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";
import acoustic_grand_piano from "../lib/acoustic_grand_piano-mp3";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let bayanBody: Bayan = Bayan.GetInstance();

window.onload = function() {
    init();
}


function init(): void {
    let soundfont: SoundFont = new SoundFont("acoustic_grand_piano");
    for (let i: number = 0; i < 4; i++) {
        let temp: any = document.getElementById("key" + i.toString());
        for (let j: number = 0; j < keyCol[i].length; j++) {
            let tempDiv: any = document.createElement("div");
            let tempSpan: any = document.createElement("span");
            temp.appendChild(tempDiv);
            let tempKey: BayanKey = new BayanKey(keyCol[i][j], tempDiv, soundfont);
            tempKey.initColor();
            tempDiv.appendChild(tempSpan);
            tempDiv.setAttribute("name", keyCol[i][j]);
            tempSpan.innerHTML = keyCol[i][j];
            tempSpan.setAttribute("class", "keyNum");
            bayanBody.add(tempKey);
        }
    }
}

function keyUp(event: any): void {
    let tempDiv: any = getTempDiv(event.keyCode);
    if (tempDiv !== undefined) {
        tempDiv.keyUp();
    }
}

function keyDown(event: any): void {
    let tempDiv: any = getTempDiv(event.keyCode);
    if (tempDiv !== undefined) {
        tempDiv.keyDown();
    }
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;

function getkeyValue(keycode: number): string {
    let realkey: string;
    switch(keycode) {
        case 186: realkey = ";"; break;
        case 187: realkey = "="; break;
        case 188: realkey = ","; break;
        case 189: realkey = "-"; break;
        case 190: realkey = "."; break;
        case 191: realkey = "/"; break;
        case 219: realkey = "["; break;
        // case 220: realkey = "\\" break;
        case 221: realkey = "]"; break;
        case 222: realkey = "'"; break;
        default: realkey = String.fromCharCode(keycode);
    }
    return realkey;
}

function getTempDiv(keycode: number): any {
    let realkey: string = getkeyValue(keycode);
    return bayanBody.getkey(realkey);
}