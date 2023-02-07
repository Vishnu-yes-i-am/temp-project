import { ImageMetadataViewModel } from "./image-metadata.view-model";

export class ImportEntityViewModel extends ImageMetadataViewModel{
    hasNoMapping: boolean = false;
    srcCsv: string = ''
}