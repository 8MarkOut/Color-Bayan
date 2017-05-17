class BayanKey {
    private keyChar: string;
    private keyElement: any;
    private sound: any;
    private black_key: string = "48WEYUP[AFGKLCM=";
    constructor(keyChar: string, keyElement: any, sound: any) {
        this.keyChar = keyChar;
        this.keyElement = keyElement;
        this.sound = sound;
        this.init();
    }
    public getKeyChar(): string {
        return this.keyChar;
    }
    public getKeyElement(): any {
        return this.keyElement;
    }
    public identify(keyChar: string): boolean {
        return this.keyChar === keyChar;
    }
    public changeColor(): void {
        if (this.keyElement !== undefined)
            this.keyElement.setAttribute("class", "key green");
    }
    public init(): void {
        if (this.keyElement !== undefined) {
            if (this.black_key.indexOf(this.keyChar) >= 0)
                this.keyElement.setAttribute("class", "key deep-gray");
            else
                this.keyElement.setAttribute("class", "key gray");
        }
    }
    public playSound(): void { this.sound.play(); }
}

export { BayanKey };
