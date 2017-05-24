import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
// import { Piano } from "./Piano";

import { SoundFont } from "./SoundFont";
import * as $ from "jquery";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let keyBd: Array<string>;
let Music: Array<string>;
let Instrument: Array<string>;
let Mobile: Array<Array<string>>;
let play: any;

window.onload = function(){
    init();
    init_button();
    init_piano();
}

function init_button(): void {
    $.ajax("https://www.easy-mock.com/mock/592183d59aba4141cf29581d/example/user").then(function(data){
            keyBd = data.keyBd;
            Music = data.Music;
            Instrument = data.Instrument;
            Mobile = [keyBd, Music, Instrument];
            initDropdownMenu();
            initMoblie();
    });
}

function initDropdownMenu(): void {
    let dropdown_content: any = document.getElementsByClassName("dropdown-content");
    for (let i: number = 0; i < Mobile.length; i++) {
        let tempElement: any = dropdown_content[i];
        for (let j: number = 0; j < Mobile[i].length; j++) {
            let tempLi: any = document.createElement("li");
            let tempA: any = document.createElement("a");
            tempElement.appendChild(tempLi);
            tempLi.appendChild(tempA);
            tempA.innerHTML = Mobile[i][j];
            if (i === 0) tempLi.onclick = function() { Bayan.getInstance().setKeybd(keyBd[j]); }
            if (j !== Mobile[i].length - 1) {
                let temp: any = document.createElement("li");
                temp.setAttribute("class", "divider");
                tempElement.appendChild(temp);
            }
        }
    }    
}

function initMoblie(): void {
    let setMoblie: any = document.getElementsByClassName("collapsible-body");

    for (let i: number = 0; i < Mobile.length; i++) {{
        let tempUl: any = document.createElement("ul");
        setMoblie[i].appendChild(tempUl);
        for (let j: number = 0; j < Mobile[i].length; j++) {
            let tempLi: any = document.createElement("li");
            let tempA: any = document.createElement("a");
            tempUl.appendChild(tempLi);
            tempLi.appendChild(tempA);
            tempA.innerHTML = Mobile[i][j];
            tempA.setAttribute("class", "waves-effect");
            if (i === 0) tempLi.onclick = function() { Bayan.getInstance().setKeybd(keyBd[j]); }
        }
    }}

}

function init(): void {
    let soundfont: SoundFont = new SoundFont("acoustic_grand_piano");
    Bayan.getInstance().soundFont = soundfont;
    let bayan: any = document.getElementById("Bayan");
    for (let i: number = 0; i < 4; i++) {
        let temp: any = document.createElement("div");
        temp.setAttribute("id", "key".concat(i.toString()));
        temp.setAttribute("class", "box");
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
        bayan.appendChild(temp);
    }
}

function keyUp(event: any): void {
    let realkey = getkeyValue(event.keyCode);
    let bayan = Bayan.getInstance();
    switch(realkey) {
        case "enter":
            if (bayan.shift + 12 <= bayan.keybdMap.upperBound)
                bayan.shift += 12;
            // console.log("8va");
            break;
        case "shift":
            if(bayan.shift - 12 >= bayan.keybdMap.lowerBound) 
            bayan.shift -= 12;
            // console.log("8vb");
            break;
        case "add":
            if (bayan.shift + 1 <= bayan.keybdMap.upperBound)
                bayan.shift ++;
            bayan.initColor();
                break;
        case "sub":
            if (bayan.shift - 1 >= bayan.keybdMap.lowerBound)
                bayan.shift --;
            bayan.initColor();
                break;
        case "play":
            if (Bayan.getInstance().playing) {
                Bayan.getInstance().stopPlay();
                clearInterval(play);
            } else {
                console.log("Start");
                play = setInterval(Bayan.getInstance().autoPlay, 50);
            }
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
        case 37: realkey = "add"; break;
        case 39: realkey = "sub"; break;
        case 32: realkey = "play"; break;
        default: realkey = String.fromCharCode(keycode);
    }
    return realkey;
}

function getTempDiv(realkey: string): any {
    return Bayan.getInstance().getkey(realkey);
}

function init_piano(): void {
    let piano: any = document.getElementById("Piano");

    let box: any = document.createElement("div");
    box.setAttribute("class", "piano-box");

    let white_box: any = document.createElement("div");
    white_box.setAttribute("class", "white-box");
    for (let j: number =0; j < 52; j++) {
        let temp: any = document.createElement("div");
        temp.setAttribute("class", "white-key");
        white_box.appendChild(temp);
    }

    let black_box: any = document.createElement("div");
    black_box.setAttribute("class", "black-box");
    let hidden = [ false, false, true, false, false, false, true];
    for (let j: number =0; j < 51; j++) {
        let temp: any = document.createElement("div");
        temp.setAttribute("class", "black-key");
        if (hidden[(j + 5) % 7])
            temp.style.visibility = "hidden";
        black_box.appendChild(temp);
    }
    
    box.appendChild(white_box);
    box.appendChild(black_box);

    piano.appendChild(box);
}