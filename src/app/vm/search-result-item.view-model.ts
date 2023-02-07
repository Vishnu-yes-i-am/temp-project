import { SafeUrl } from "@angular/platform-browser";
import { ImageMetadataViewModel } from "./image-metadata.view-model";

export class SearchResultItemViewModel extends ImageMetadataViewModel{
    public pictureID: number = 0;
    public imgSrc: SafeUrl = '';
}