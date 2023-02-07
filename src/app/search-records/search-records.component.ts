import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ImageMetadataViewModel } from '../vm/image-metadata.view-model';
import { PaginateAction } from '../vm/pagination.view-model';
import { SearchRecordsViewModel } from '../vm/search-records.view-model';
import { SearchResultItemViewModel } from '../vm/search-result-item.view-model';
import { SearchStateViewModel } from '../vm/search-state.view-model';

@Component({
  selector: 'app-search-records',
  templateUrl: './search-records.component.html',
  styleUrls: ['./search-records.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: {
        stopOnClickPropagation: true,
        autoClose: true
      }
    }
  ]
})
export class SearchRecordsComponent {
  @Input()
  public searchRecords: SearchRecordsViewModel = new SearchRecordsViewModel();
  @Input()
  public searchState: SearchStateViewModel = new SearchStateViewModel();
  @Input()
  public userPermissions: string[] = [];
  @Output()
  public view:EventEmitter<SearchResultItemViewModel> = new EventEmitter<SearchResultItemViewModel>();
  @Output()
  public edit:EventEmitter<SearchResultItemViewModel> = new EventEmitter<SearchResultItemViewModel>();
  @Output()
  public download:EventEmitter<SearchResultItemViewModel> = new EventEmitter<SearchResultItemViewModel>();
  @Output()
  public delete:EventEmitter<SearchResultItemViewModel> = new EventEmitter<SearchResultItemViewModel>();
  @Output()
  public filter: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public paginate: EventEmitter<PaginateAction> = new EventEmitter<PaginateAction>();
  disallow(ev: Event): void {
    ev?.preventDefault();
  }
  editClicked(item: SearchResultItemViewModel): void {
    this.edit.emit(item)
  }
  downloadClicked(item: SearchResultItemViewModel): void {
    this.download.emit(item)
  }
  deleteClicked(item: SearchResultItemViewModel): void {
    this.delete.emit(item);
  }
  rowClicked(item: SearchResultItemViewModel, ev: Event): void {
    if(!['A', 'UL', 'LI', 'I', 'BUTTON'].includes((ev as any).path[0].tagName)) // dropdown clicked - stopOnClickPropagation: true doesnt help with options, only the parent
      this.view.emit(item);
  }
  filterInput(ev: KeyboardEvent): void {
    if(['Enter', 'NumpadEnter'].includes(ev.code) && this.isFormValid())
      this.filter.emit();
  }
  isFormValid(): boolean {
    return JSON.stringify(this.searchRecords.customSearchForm).length > JSON.stringify(new ImageMetadataViewModel).length
  }
  onPaginate(page: PaginateAction): void {
    this.paginate.emit(page);
  }
  checkAccess(action: string): string {
    return this.userPermissions?.includes(action) ? '' : 'disabled';
  }
}