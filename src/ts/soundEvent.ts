/*
    This is a namespace about soundEvent
*/

import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";

namespace soundEvent{
    let sf = SoundFont.getInstance();
    // play the sound of the related key
    export let playSound = function(keyName: string): void {
        let key = getSoundKey(keyName);
        if (!sf.isplaying[key]) {
            sf.isplaying[key] = true;
            sf.audio[key].play();
        }
    }

    // stop the sound of the related key
    export let stopSound = function(keyName: string): void {
        let key = getSoundKey(keyName);
        let audio: any = sf.audio[key];
        audio.pause();
        audio.currentTime = 0;
        sf.isplaying[key] = false;
    }

    // Get the sound key by key name
    let getSoundKey = function(keyName: string): number {
        let bayan = Bayan.getInstance();
        let rVal: number = bayan.keybdMap[keyName] + bayan.shift;
        return SoundFont.normalizeKey(rVal); 
    }
}

export { soundEvent };
