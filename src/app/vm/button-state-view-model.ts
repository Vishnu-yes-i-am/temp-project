export class ButtonStateViewModel{
    private _defaultText: string;
    public isDisabled: boolean;
    public text: string;
    constructor(defaultText: string){
        this._defaultText = defaultText;
        this.isDisabled = false;
        this.text = defaultText;
    }
    setLoading(): void{
        this.text = 'Please wait...';
        this.isDisabled = true;
    }
    removeLoading(): void{
        this.text = this._defaultText;
        this.isDisabled = false;
    }
    public set defaultText(defaultText: string){
        var updateText:boolean = false;
        if(this.text === this._defaultText)
            updateText = true;
        this._defaultText = defaultText;
        if(updateText)
            this.text = defaultText;
    }
}