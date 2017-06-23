/*
    This is a namespace about keybdEvent
*/

import { MainController } from "./mainController";
import { Bayan } from "./Bayan";
import { soundEvent } from "./soundEvent";

namespace keybdEvent {
    
    // The event when the key of keyboard is Up
    export let keyUp = function(event: any): void {
        let realkey = getkeyValue(event.keyCode);
        let bayan = Bayan.getInstance();
        switch(realkey) {
            case "enter":
                if (bayan.shift + 12 <= bayan.keybdMap.upperBound) {
                    bayan.shift += 12;
                    bayan.soundfield.low += 12;
                    bayan.soundfield.high += 12;
                }
                    
                break;
            case "shift":
                if(bayan.shift - 12 >= bayan.keybdMap.lowerBound) {
                    bayan.shift -= 12;
                    bayan.soundfield.low -= 12;
                    bayan.soundfield.high -= 12;
                }
                break;
            case "add":
                if (bayan.shift + 1 <= bayan.keybdMap.upperBound) {
                    bayan.shift ++;
                    bayan.soundfield.low ++;
                    bayan.soundfield.high ++;
                    bayan.initColor();
                }
                break;
            case "sub":
                if (bayan.shift - 1 >= bayan.keybdMap.lowerBound) {
                    bayan.shift --;
                    bayan.soundfield.low --;
                    bayan.soundfield.high --;
                    bayan.initColor();
                }
                break;
            case "space":
                if (MainController.getInstance().playing)
                    MainController.getInstance().stopPlay();
                else 
                    MainController.getInstance().play();
                break;
        }
        let tempDiv: any = getDiv(realkey);
        if (tempDiv !== undefined) {
            tempDiv.keyUp();
            soundEvent.stopSound(realkey);
        }
    }

    // The event when the key of keyboard is Down
    export let keyDown = function(event: any): void {
        let ifIE: boolean = navigator.appName == "Microsoft Internet Explorer";
        let realkey = (ifIE) ? getkeyValue(event.keyCode) : getkeyValue(event.which);
        let tempDiv: any = getDiv(realkey);
        if (tempDiv !== undefined) {
            tempDiv.keyDown();
            soundEvent.playSound(realkey);
        }
    }

    // Get the real value about the key which we pressed down
    let getkeyValue = function(keycode: number): string {
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
            case 32: realkey = "space"; break;
            default: realkey = String.fromCharCode(keycode);
        }
        return realkey;
    }

    // Get the div DOM by key value
    let getDiv = function(realkey: string): any {
        return Bayan.getInstance().getkey(realkey);
    }
}

export { keybdEvent };
