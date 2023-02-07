import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchFilterViewModel } from '../vm/search-filter-form.view-model';
import { SearchFilterItem } from '../vm/search-filter-item.view-model';

@Component({
  selector: 'app-search-filter-form',
  templateUrl: './search-filter-form.component.html',
  styleUrls: ['./search-filter-form.component.scss']
})
export class SearchFilterFormComponent implements OnInit {
  @Input()
  searchFilter:SearchFilterViewModel = new SearchFilterViewModel
  @Output()
  powerSearch:EventEmitter<void> = new EventEmitter
  constructor() { }

  ngOnInit(): void {
  }
  addNew(index:number, nextItemLink?: 'x' | '+'):void{
    if(!this.searchFilter.filterItems[index + 1])
      this.searchFilter.filterItems.splice(index + 1, 0, new SearchFilterItem());
    this.searchFilter.filterItems[index].nextItemLink = nextItemLink;
  }
  removeAt(index:number):void{
    if(this.searchFilter.filterItems.length === 1)
      return;
    if(this.searchFilter.filterItems.length - 1 === index)
      this.searchFilter.filterItems[index - 1].nextItemLink = undefined;
    this.searchFilter.filterItems.splice(index, 1)
  }
  doPowerSearch(){
    this.powerSearch.emit()
  }
}
