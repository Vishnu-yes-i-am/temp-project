export class SearchStateViewModel{
    public quickSearchQuery: string = '';
    public searchType: SearchType;
    public searchCount: number = 0;
}

export type SearchType = "autosuggest" | "quick" | "power" | "custom" | undefined;