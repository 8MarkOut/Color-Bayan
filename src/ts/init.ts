import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let bayanBody: Bayan = Bayan.getInstance();

window.onload = function(){
    init();
}

function init(): void {
    let soundfont: SoundFont = new SoundFont("acoustic_grand_piano");
    for (let i: number = 0; i < 4; i++) {
        let temp: any = document.getElementById("key" + i.toString());
        for (let j: number = 0; j < keyCol[i].length; j++) {
            let tempDiv: any = document.createElement("div");
            let tempSpan: any = document.createElement("span");
            let tempDisplay: any = document.createElement("span");
            temp.appendChild(tempDiv);
            let tempKey: BayanKey = new BayanKey(keyCol[i][j], tempDiv, soundfont);
            tempKey.initColor();
            tempDiv.appendChild(tempSpan);
            tempDiv.appendChild(tempDisplay);

            // 这样写有蜜汁错误
            // tempDiv.onmousedown = tempKey.keyDown;
            // tempDiv.onmouseup = tempKey.keyUp;
            // tempDiv.onmouseout = tempKey.keyUp;
            tempDiv.onmousedown = function() { tempKey.keyDown(); }
            tempDiv.onmouseup = function() { tempKey.keyUp(); }
            tempDiv.onmouseout = function() { tempKey.keyUp(); }

            tempDiv.setAttribute("name", keyCol[i][j]);
            tempSpan.innerHTML = keyCol[i][j];
            tempSpan.setAttribute("class", "keyNum");
            tempDisplay.setAttribute("class", "display");
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
