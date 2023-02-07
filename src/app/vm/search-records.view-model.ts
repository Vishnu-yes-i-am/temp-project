import { ImageMetadataViewModel } from "./image-metadata.view-model";
import { PaginationViewModel } from "./pagination.view-model";
import { SearchResultsViewModel } from "./search-results.view-model";

export class SearchRecordsViewModel{
    private _searchResults: SearchResultsViewModel = new SearchResultsViewModel();
    public customSearchForm: ImageMetadataViewModel = new ImageMetadataViewModel;
    private _pagination: PaginationViewModel = new PaginationViewModel();
    public get searchResults() {
        return this._searchResults;
    }
    public set searchResults(results: SearchResultsViewModel) {
        this._searchResults = results;
        this._pagination = new PaginationViewModel(results.pageCount)
    }
    public get pagination(): PaginationViewModel{
        return this._pagination;
    }
}