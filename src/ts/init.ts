import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
import { Piano } from "./Piano";

import { SoundFont } from "./SoundFont";
import { keybdEvent } from "./keyBoardEvent";
import { soundEvent } from "./soundEvent";

import { request } from "./request";

import * as $ from "jquery";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let file: any;

window.onload = function(){
    init();
    request.requestButton(initDropdownMenu, initMoblie);
    init_piano();
    init_drag();
}

document.onkeydown = keybdEvent.keyDown;
document.onkeyup = keybdEvent.keyUp;

function initDropdownMenu(): void {
    let dropdown_content: any = document.getElementsByClassName("dropdown-content");
    for (let i: number = 0; i < request.Mobile.length; i++) {
        let tempElement: any = dropdown_content[i];
        for (let j: number = 0; j < request.Mobile[i].length; j++) {
            let tempLi: any = document.createElement("li");
            let tempA: any = document.createElement("a");
            tempElement.appendChild(tempLi);
            tempLi.appendChild(tempA);
            tempA.innerHTML = request.Mobile[i][j];
            if (i === 0) tempLi.onclick = () => { Bayan.getInstance().setKeybd(request.keyBd[j]); }
            if (j !== request.Mobile[i].length - 1) {
                let temp: any = document.createElement("li");
                temp.setAttribute("class", "divider");
                tempElement.appendChild(temp);
            }
        }
    }    
}

function initMoblie(): void {
    let setMoblie: any = document.getElementsByClassName("collapsible-body");

    for (let i: number = 0; i < request.Mobile.length; i++) {{
        let tempUl: any = document.createElement("ul");
        setMoblie[i].appendChild(tempUl);
        for (let j: number = 0; j < request.Mobile[i].length; j++) {
            let tempLi: any = document.createElement("li");
            let tempA: any = document.createElement("a");
            tempUl.appendChild(tempLi);
            tempLi.appendChild(tempA);
            tempA.innerHTML = request.Mobile[i][j];
            tempA.setAttribute("class", "waves-effect");

            // Set keyBd
            if (i === 0) {
                tempLi.onclick = () => { Bayan.getInstance().setKeybd(request.keyBd[j]); }
            // Get music
            } else if(i == 1) {
                tempLi.onclick = () => request.requestMid(j);
            // Get instrument
            } else {
                tempLi.onclick = () => request.requestInstrument(j);
            }
        }
    }}

}

function init(): void {
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
            let tempKey: BayanKey = new BayanKey(keyCol[i][j], tempDiv);
            tempKey.initColor();
            tempDiv.appendChild(tempSpan);
            tempDiv.appendChild(tempDisplay);

            tempDiv.onmousedown = () => { tempKey.keyDown(); soundEvent.playSound(tempKey.getKeyChar()); }
            tempDiv.onmouseup = () => { tempKey.keyUp(); soundEvent.stopSound(tempKey.getKeyChar()); }
            tempDiv.onmouseout = () => { tempKey.keyUp(); soundEvent.stopSound(tempKey.getKeyChar()); }

            tempDiv.setAttribute("name", keyCol[i][j]);
            tempSpan.innerHTML = keyCol[i][j];
            tempSpan.setAttribute("class", "keyNum");
            tempDisplay.setAttribute("class", "display");
            Bayan.getInstance().add(tempKey);
        }
        bayan.appendChild(temp);
    }
}

function init_piano() {
    let piano: any = document.getElementById("Piano");
        let box: any = document.createElement("div");
        box.setAttribute("id", "piano-box");

        let white_box: any = document.createElement("div");
        white_box.setAttribute("id", "white-box");
        for (let j: number = 0; j < 52; j++) {
            let temp: any = document.createElement("div");
            temp.setAttribute("class", "white-key");
            white_box.appendChild(temp);
            Piano.getInstance().bindMouseEvent(temp, j, true);
        }

        let black_box: any = document.createElement("div");
        black_box.setAttribute("id", "black-box");
        let hidden = [ false, false, true, false, false, false, true];
        for (let j: number = 0; j < 51; j++) {
            let temp: any = document.createElement("div");
            temp.setAttribute("class", "black-key");
            if (hidden[(j + 5) % 7]) {
                temp.style.visibility = "hidden";
            } else {
                Piano.getInstance().bindMouseEvent(temp, j, false);
            }
            black_box.appendChild(temp);
        }
        
        box.appendChild(white_box);
        box.appendChild(black_box);
        piano.appendChild(box);
}

function init_drag() {
    let drag: any = document.getElementById("main");
    drag.addEventListener('drop', dropHandler, false);
    drag.addEventListener('dragover', dragOverHandler, false);
}

function dropHandler(e: any) {
    e.stopPropagation();
    e.preventDefault();

    let files: any = e.dataTransfer.files;
    for(var i = 0, len = files.length; i < len; i++) {
        var f = files[i];
        // console.log(f.name + " " + f.size + " ");
        console.log(f);
        readAsArrayBuffer(f);
    }
}

// get the Data from MID file
let fileData: any;

function dragOverHandler(e: any) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dragEffect = 'copy';
}

function readAsArrayBuffer(file: any) { 
    var reader = new FileReader();    
    reader.onload = (e) => {
        fileData = reader.result.split('').map((v: any) => {
            return ('0'+ v.charCodeAt(0).toString(16)).slice(-2);
        });
        fileData = fileData.join("");
        console.log(fileData);
    }
    reader.readAsBinaryString(file);
}