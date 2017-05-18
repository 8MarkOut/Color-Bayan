import { BayanKey } from "./BayanKey";

class Bayan {
    public static getInstance() : Bayan {
        if (Bayan._instance == null){
            Bayan._instance = new Bayan();
        }
        return Bayan._instance;
    }
    private static _instance: Bayan = null;
    private keys = new Array<BayanKey>();
    public add(key: BayanKey): void {
        this.keys.push(key);
    }
    public getkey(keyCode: string): BayanKey {
        for (let i:number = 0; i < this.keys.length; i++) {
            if (this.keys[i].identify(keyCode))
                return this.keys[i];
        }
    }
}

export { Bayan };
