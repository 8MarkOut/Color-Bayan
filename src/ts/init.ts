import { BayanKey } from "./BayanKey";
import { Bayan } from "./Bayan";
import { Piano } from "./Piano";

import { SoundFont } from "./SoundFont";
import { keybdEvent } from "./keyBoardEvent";
import { soundEvent } from "./soundEvent";
import * as $ from "jquery";

let keyCol: Array<string> = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
let keyBd: Array<string>;
let Music: Array<string>;
let Instrument: Array<string>;
let Mobile: Array<Array<string>>;

window.onload = function(){
    init();
    init_button();
    Piano.getInstance().initHTML();
}

document.onkeydown = keybdEvent.keyDown;
document.onkeyup = keybdEvent.keyUp;

function init_button(): void {
    $.ajax("https://www.easy-mock.com/mock/592183d59aba4141cf29581d/example/user").then(function(data){
            keyBd = data.keyBd;
            Music = data.Music;
            Instrument = data.Instrument;
            Mobile = [keyBd, Music, Instrument];
            initDropdownMenu();
            initMoblie();
    });
    
    // It is used for test without network.

    // keyBd = ["keyboardMap3", "keyboardMap4"];
    // Music = ["M1", "M2", "M3"];
    // Instrument = ["In1", "In2"];
    // Mobile = [keyBd, Music, Instrument];
    // initDropdownMenu();
    // initMoblie();
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
            if (i === 0) tempLi.onclick = () => { Bayan.getInstance().setKeybd(keyBd[j]); }
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
            // Set keyBd
            if (i === 0) {
                tempLi.onclick = () => { Bayan.getInstance().setKeybd(keyBd[j]); }
            // Get music
            } else if(i == 1) {
                tempLi.onclick = () => {
                    $.get("https://www.easy-mock.com/mock/592183d59aba4141cf29581d/example/query", {name: Mobile[i][j]}, function(data) {
                        // Data is the stream of Mid file we recepted.
                        // And here should be a function to recept the data stream and play it.
                        console.log(data.data.name);
                        console.log("Play Music!!!");
                    });
                }
            // Get instrument
            } else {
                tempLi.onclick = function() {
                    $.get("https://www.easy-mock.com/mock/592183d59aba4141cf29581d/example/query", {name: Mobile[i][j]}, function(data) {
                        // A function used to change the instrument should be here.
                        console.log(data.data.name);
                        console.log("Change instrument!!!");
                    });
                }
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

            // 这样写有蜜汁错误
            // tempDiv.onmousedown = tempKey.keyDown;
            // tempDiv.onmouseup = tempKey.keyUp;
            // tempDiv.onmouseout = tempKey.keyUp;
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
