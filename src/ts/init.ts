import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
import { Piano } from "./Piano";
import { PianoRoll } from "./PianoRoll";

import { SoundFont } from "./SoundFont";
import { keybdEvent } from "./keyBoardEvent";
import { soundEvent } from "./soundEvent";

import { KeyEvent } from "./mainController";
import { MainController } from "./mainController";
import { MIDIParser } from "./MIDIParser";

import { request } from "./request";
import { dropEvent } from "./dropEvent";

import * as $ from "jquery";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let file: any;

window.onload = function(){
    init();
    request.requestButton(initDropdownMenu, initMoblie);
    init_piano();
    init_drag();
    init_piano_roll();
    init_PlayButton()
}

// document.onkeydown = keybdEvent.keyDown;
// document.onkeyup = keybdEvent.keyUp;

window.onresize = function() {
    PianoRoll.getInstance().resize();
    let piano = document.getElementById("Piano");
    let mainbox = document.getElementById("main");
    let pbox = document.getElementById("piano-box");
    let canvas = document.getElementById("piano-roll");
    let displayStatus = piano.style.display;
    piano.style.display = "none";
    let height = mainbox.offsetHeight;
    console.log(height);
    piano.style.display = "flex";
    let width = pbox.offsetWidth;
    height -= pbox.offsetHeight + 10;
    piano.style.display = displayStatus;
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
    
} 

window.addEventListener('keydown', keybdEvent.keyDown, false);
window.addEventListener('keyup', keybdEvent.keyUp, false);

// 初始化下拉栏
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
            // Set request
            switch(i) {
                case 0 :
                    tempLi.onclick = () => { Bayan.getInstance().setKeybd(request.keyBd[j]) };  break;
                case 1 :
                    tempLi.onclick = () => request.requestMid(j); break;
                case 2 :
                    tempLi.onclick = () => request.requestInstrument(j); break;
            }
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

            // Set request
            switch(i) {
                case 0 :
                    tempLi.onclick = () => { Bayan.getInstance().setKeybd(request.keyBd[j]) };  break;
                case 1 :
                    tempLi.onclick = () => request.requestMid(j); break;
                case 2 :
                    tempLi.onclick = () => request.requestInstrument(j); break;
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
            $(tempDiv).on('touchstart', () => { tempKey.keyDown(); soundEvent.playSound(tempKey.getKeyChar()) });
            $(tempDiv).on('touchend', () => { tempKey.keyUp(); soundEvent.stopSound(tempKey.getKeyChar()); });

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
    
    box.appendChild(black_box);
    box.appendChild(white_box);
    piano.appendChild(box);
}

function init_piano_roll() {
    let piano: any = document.getElementById("Piano");
    let canvas: any = document.createElement("canvas");
    piano.style.display = "flex";
    let mainbox = document.getElementById("main");
    let pbox = document.getElementById("piano-box");
    
    console.log(mainbox.offsetHeight);
    // console.log(pbox.offsetWidth);
    console.log(pbox.offsetHeight);

    let width = pbox.offsetWidth;
    let height = mainbox.offsetHeight - pbox.offsetHeight - 10;
    
    canvas.setAttribute("id", "piano-roll");
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
    piano.appendChild(canvas);
    piano.style.display = "none";
    setInterval(function(){
        PianoRoll.getInstance().run(canvas);
    }, 50);
}

function init_drag() {
    let drag: any = document.getElementById("main");
    drag.addEventListener('drop', dropEvent.dropHandler, false);
    drag.addEventListener('dragover', dropEvent.dragOverHandler, false);
}

function init_PlayButton() {
    let playButton = document.getElementById("realButton");
    playButton.onclick = () => {
        let playArrow = document.getElementById("playArrow");
        if (playArrow.innerText == "play_arrow") {
            MainController.getInstance().play();
            playArrow.innerText = "pause";
        } else {
            MainController.getInstance().stopPlay();
            playArrow.innerHTML = "play_arrow";
        }
    }
}