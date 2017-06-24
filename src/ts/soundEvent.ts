/*
    This is a namespace about soundEvent
*/

import { Bayan } from "./Bayan";
import { SoundFont } from "./SoundFont";

namespace soundEvent{
    let sf = SoundFont.getInstance();
    // play the sound of the related key
    export let playSound = (keyName: string): void => {
        // stopSound(keyName);
        let key = getSoundKey(keyName);
        if (sf.isplayinglock[key] > 0) {   
            sf.isplayinglock[key] --;
            sf.audio[key].currentTime = 0;
            sf.audio[key].play();
        }
    }

    // stop the sound of the related key
    export let stopSound = (keyName: string): void => {
        let key = getSoundKey(keyName);
        let audio: any = sf.audio[key];
        audio.pause();
        audio.currentTime = 0;
        sf.isplayinglock[key] ++;
    }

    // Get the sound key by key name
    let getSoundKey = (keyName: string): number => {
        let bayan = Bayan.getInstance();
        let rVal: number = bayan.keybdMap[keyName] + bayan.shift;
        return SoundFont.normalizeKey(rVal); 
    }
}

export { soundEvent };
