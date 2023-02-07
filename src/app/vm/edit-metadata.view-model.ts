import { ImageMetadataViewModel } from "./image-metadata.view-model";

export class EditMetaDataViewModel<T extends ImageMetadataViewModel>{
    data: T;
    rawDateInput: Date;
    constructor(data: T, rawDateInput: Date){
        this.data = data,
        this.rawDateInput = rawDateInput;
    }
}