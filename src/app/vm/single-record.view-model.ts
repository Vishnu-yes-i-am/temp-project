import { SafeUrl } from "@angular/platform-browser";
import { SearchResultItemViewModel } from "./search-result-item.view-model";

export class SingleRecordViewModel extends SearchResultItemViewModel{
    public fullSizeImgSrc: SafeUrl = '';
}