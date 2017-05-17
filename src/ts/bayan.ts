import { bayan_key } from "./bayan_key";

class bayan {
    private keys = new Array<bayan_key>();
    public add(key: bayan_key): void {
        this.keys.push(key);
    }
    public getkey(keyCode: string): bayan_key {
        for (let i:number = 0; i < this.keys.length; i++) {
            if (this.keys[i].identify(keyCode))
                return this.keys[i];
        }
    }
}

export { bayan };
