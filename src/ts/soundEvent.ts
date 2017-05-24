/*
    This is a namespace about soundEvent
*/

import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";

namespace soundEvent{

    // play the sound of the related key
    export let playSound = function(keyName: string): void {
        Bayan.getInstance().soundFont.audio[getSoundKey(keyName)].play();
    }

    // stop the sound of the related key
    export let stopSound = function(keyName: string): void {
        // delay
        let audio: any = Bayan.getInstance().soundFont.audio[getSoundKey(keyName)];
        audio.pause();
        audio.currentTime = 0;
    }

    // Get the sound key by key name
    let getSoundKey = function(keyName: string): number {
        let bayan = Bayan.getInstance();
        let rVal: number = bayan.keybdMap[keyName] + bayan.shift;
        return SoundFont.normalizeKey(rVal); 
    }
}

export { soundEvent };