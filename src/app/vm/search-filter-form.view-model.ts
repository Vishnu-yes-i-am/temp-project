import { CriteriaOptionViewModel } from "./criteria-options.view-model";
import { SearchFilterItem } from "./search-filter-item.view-model";

export class SearchFilterViewModel{
    public isOpen:boolean = false;
    public filterItems:SearchFilterItem[] = [new SearchFilterItem]
    public criteriaOptions: CriteriaOptionViewModel[] = [];
}