import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let keyBd: Array<string> = ["keyboardMap3", "keyboardMap4"]

window.onload = function(){
    init();
    initDropdownMenu();
    initMoblie();
}

function initDropdownMenu(): void {
    let setKeybd: any = document.getElementById("setkeybd");
    for (let i: number = 0; i < keyBd.length; i++) {
        let tempLi: any = document.createElement("li");
        let tempA: any = document.createElement("a");
        setKeybd.appendChild(tempLi);
        tempLi.appendChild(tempA);
        tempA.innerHTML = keyBd[i];
        tempLi.onclick = function() { Bayan.getInstance().setKeybd(keyBd[i]); }
        if (i !== keyBd.length - 1) {
            let temp: any = document.createElement("li");
            temp.setAttribute("class", "divider");
            setKeybd.appendChild(temp);
        }
    }
}

function initMoblie(): void {
    let setMoblie: any = document.getElementsByClassName("collapsible-body");

    let tempUl: any = document.createElement("ul");
    setMoblie[0].appendChild(tempUl);
    for (let i: number = 0; i < keyBd.length; i++) {
        let tempLi: any = document.createElement("li");
        let tempA: any = document.createElement("a");
        tempUl.appendChild(tempLi);
        tempLi.appendChild(tempA);
        tempA.innerHTML = keyBd[i];
        tempA.setAttribute("class", "waves-effect");
        tempLi.onclick = function() { Bayan.getInstance().setKeybd(keyBd[i]); }
    }
}

function init(): void {
    let soundfont: SoundFont = new SoundFont("acoustic_grand_piano");
    Bayan.getInstance().soundFont = soundfont;
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
            Bayan.getInstance().add(tempKey);
        }
    }
}

function keyUp(event: any): void {
    let realkey = getkeyValue(event.keyCode);
    switch(realkey) {
        case "enter":
            Bayan.getInstance().shift += 12;
            console.log("8va");
            break;
        case "shift":
            Bayan.getInstance().shift -= 12;
            console.log("8va");
            break;
    }
    let tempDiv: any = getTempDiv(realkey);
    if (tempDiv !== undefined) {
        tempDiv.keyUp();
    }
}

function keyDown(event: any): void {
    let realkey = getkeyValue(event.keyCode);
    let tempDiv: any = getTempDiv(realkey);
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
        case 13: realkey = "enter"; break;
        case 16: realkey = "shift"; break;
        default: realkey = String.fromCharCode(keycode);
    }
    return realkey;
}

function getTempDiv(realkey: string): any {
    return Bayan.getInstance().getkey(realkey);
}
