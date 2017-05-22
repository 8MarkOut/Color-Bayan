class TimeController {
    public time: number;
    private timeout: any;
    private static _instance: TimeController = null;
    public static getInstance() : TimeController {
        if (TimeController._instance == null){
            TimeController._instance = new TimeController();
        }
        return TimeController._instance;
    }
    constructor() { this.time = 0; }
    public reset(): void { this.time = 0; }
    public getTime(): number { return this.time; }
    public start(): void {
        this.timeout = self.setInterval(TimeController.getInstance().time++, 10000000000);
    }

    public stop(): void { window.clearInterval(this.timeout); }
    public finish(): void {
        this.stop();
        this.reset();
    }
}

export { TimeController };
