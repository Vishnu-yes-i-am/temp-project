import { EditMetaDataViewModel } from "./edit-metadata.view-model";
import { ImportEntityViewModel } from "./import-entity-view-model";

export class EditImportEntityViewModel extends EditMetaDataViewModel<ImportEntityViewModel>{
    replicate: number;
    show: boolean;
    constructor(data:ImportEntityViewModel = new ImportEntityViewModel(), replicate:number = 0, show: boolean = false, rawDateInput: Date = new Date()){
        super(data, rawDateInput);
        this.replicate = replicate;
        this.show = show;
    }
}