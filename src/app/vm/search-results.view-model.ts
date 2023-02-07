import { SearchResultItemViewModel } from "./search-result-item.view-model";

export class SearchResultsViewModel{
    public items: SearchResultItemViewModel[] = [];
    public pageCount: number = 0;
    public count: number = 0;
}