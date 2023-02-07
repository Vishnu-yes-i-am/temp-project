import { FileHandle } from "../directives/drag-drop.directive";

export class AddedFileViewModel{
    fileHandle: FileHandle;
    hasBeenProcessed: boolean;
    hasNoMapping: boolean;
    isDirty: boolean;
    hasDataFilled: boolean;
    constructor(fileHandle: FileHandle,
        hasBeenProcessed: boolean = false,
        hasNoMapping: boolean = false,
        isDirty: boolean = false,
        hasDataFilled:boolean = false){
        this.fileHandle = fileHandle;
        this.hasBeenProcessed = hasBeenProcessed;
        this.hasNoMapping = hasNoMapping;
        this.isDirty = isDirty;
        this.hasDataFilled = hasDataFilled;
    }
}