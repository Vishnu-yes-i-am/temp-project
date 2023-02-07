import { ImageMetadataViewModel } from "./image-metadata.view-model";

export class CriteriaOptionViewModel{
    criteriaID: number = 0;
    maptext: string = '';
    criteriaKey: keyof ImageMetadataViewModel = "RR";
}