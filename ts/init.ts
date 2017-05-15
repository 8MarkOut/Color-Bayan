import { bayan_key } from "./bayan_key";
import { bayan } from "./bayan";

let keyCol: Array<string> = ["234567890-", "QWERTYUIOP[", "ASDFGHJKL;'", "ZXCVBNM,./"];
let bayanBody: bayan = new bayan();

window.onload = function() {
    init();
}

function init(): void {
    for (let i: number = 1; i < 5; i++) {
        let temp: any = document.getElementById("key" + i.toString);
        for (let j: number = 0; j < keyCol[i].length; j++) {
            let tempDiv: any = document.createElement("div");
            let tempSpan: any = document.createElement("span");
            temp.appendChild(tempDiv);
            let tempKey: bayan_key = new bayan_key(keyCol[i][j], tempDiv);
            tempDiv.appendChild(tempSpan);
            tempSpan.innerHTML = keyCol[i][j];
            tempSpan.setAttribute("class", "keyNum");
            tempDiv.setAttribute("class", "key");
            tempKey.init();
            bayanBody.add(tempKey);
        }
    }
}

function keyUp(event) {
    var keycode = event.keyCode;
    var realkey = getkeyValue(keycode);
    var tempDiv = bayanBody.getkey(realkey).init();
}

function keyDown(event) {
    var keycode = event.keyCode;
    var realkey = getkeyValue(keycode);
    var tempDiv = bayanBody.getkey(realkey).changeColor();
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;

function getkeyValue(keycode) {
    var realkey;
    switch(keycode) {
        case 189: realkey = "-"; break;
        case 219: realkey = "["; break;
        case 186: realkey = ";"; break;
        case 222: realkey = "'"; break;
        case 188: realkey = ","; break;
        case 190: realkey = "."; break;
        case 191: realkey = "/"; break;
        default: realkey = String.fromCharCode(keycode);
    }
    return realkey;
}

