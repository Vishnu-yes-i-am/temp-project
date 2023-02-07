import { ButtonStateViewModel } from "./button-state-view-model";

export class ToggleActiveStateButtonStateViewModel extends ButtonStateViewModel{
    constructor(){
        super('Deactivate');
    }
    activateState(){
        super.defaultText = 'Activate';
    }
    deactivateState(){
        super.defaultText = 'Deactivate';
    }
}