import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/login.service';
import { EditSingleRecordViewModel } from '../vm/edit-single-record.view-model';
import { SearchFilterViewModel } from '../vm/search-filter-form.view-model';
import { SearchRecordsViewModel } from '../vm/search-records.view-model';
import { SearchResultItemViewModel } from '../vm/search-result-item.view-model';
import { SearchSettingsViewModel } from '../vm/search-settings.view-model';
import { SingleRecordViewModel } from '../vm/single-record.view-model';
import { SearchService } from './search.service';
import { SearchFilterItem } from '../vm/search-filter-item.view-model';
import { environment } from 'src/environments/environment';
import { SearchResultsViewModel } from '../vm/search-results.view-model';
import { SearchStateViewModel, SearchType } from '../vm/search-state.view-model';
import { PaginateAction } from '../vm/pagination.view-model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  userPermissions: string[] = [];
  searchState: SearchStateViewModel = new SearchStateViewModel;
  searchRecords:SearchRecordsViewModel = new SearchRecordsViewModel;
  searchSettings:SearchSettingsViewModel = new SearchSettingsViewModel;
  searchFilter: SearchFilterViewModel = new SearchFilterViewModel;
  singleRecord: SingleRecordViewModel = new SingleRecordViewModel;
  editSingleRecord: EditSingleRecordViewModel = new EditSingleRecordViewModel(new SingleRecordViewModel, new Date);
  modalRef: BsModalRef;
  constructor(private searchService:SearchService,
    private loginService:LoginService,
    private toastr:ToastrService,
    private domSanitizer: DomSanitizer,
    private modalService: BsModalService) { 
      this.modalRef = new BsModalRef;
      this.searchSettings.enableAutoSuggest = environment.enableAutoSuggest;
    }

  async ngOnInit(): Promise<void> {
    try{
      await Promise.all([
        this.getCriteriaOptions(),
        this.getCurrentUserPermissions()
      ]) 
      this.loginService.grantAccess()
    }
    catch(err){
      if(err instanceof HttpErrorResponse && err.status === 403)
        this.loginService.denyAccess();
      else
        this.toastr.error('Something went wrong')
    }
  }
  async getCurrentUserPermissions(): Promise<void> {
    this.userPermissions = await lastValueFrom(this.loginService.getCurrentUserPermissions());
  }
  async getCriteriaOptions():Promise<void> {
    this.searchFilter.criteriaOptions = await lastValueFrom(this.searchService.getCriteriaOptions());
  }
  async doQuickSearch(filterItems:SearchFilterItem[] = [], pageNumber:number = 1):Promise<void> {
    try{
      if(!this.searchState.quickSearchQuery && !filterItems.length){
        this.toastr.error('Please enter search criteria');
        return;
      }
      if(!this.searchSettings.quickSearchCount || isNaN(this.searchSettings.quickSearchCount)){
        this.toastr.error('Please fill settings');
        this.searchSettings.isOpen = true;
        return;
      }
      this.searchSettings.isOpen = false;
      var results: SearchResultsViewModel = await lastValueFrom(this.searchService.doQuickSearch(this.searchState.quickSearchQuery, pageNumber, this.searchSettings.quickSearchCount, filterItems));
      if(!results?.items.length){
        this.toastr.info('No search results');
        results = new SearchResultsViewModel();
        pageNumber = 0;
      }
      this.showSearchResults(results, 'quick', pageNumber)
      for(var item of this.searchRecords.searchResults.items){
        try{
          var imageBlob:Blob = await lastValueFrom(this.searchService.loadThumbnailById(item.pictureID));
          item.imgSrc = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        }
        catch(err){
          // Swallow and move on to the next one
          item.imgSrc = 'ERROR';
        }
      }
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
  }
  showSearchResults(results: SearchResultsViewModel, searchType: 'quick' | 'power' | 'autosuggest', pageNumber: number) {
    this.searchRecords.searchResults = results;
    this.searchState.searchType = searchType;
    this.searchState.searchCount = results.count;
    this.searchRecords.pagination.activeIndex = pageNumber - 1;
    this.modalRef.hide();
  }
  openPowerSearch():void{
    this.searchFilter.isOpen = true;
  }
  async doPowerSearch(pageNumber: number = 1):Promise<void>{
    try{
      let filterItems = this.searchFilter.filterItems;
      if(filterItems.some(x => !x.criteriaID || !x.value)){
        this.toastr.error('Please fill the filter form');
        return;
      }
      if(!this.searchSettings.powerSearchCount || isNaN(this.searchSettings.powerSearchCount)){
        this.toastr.error('Please fill settings');
        this.searchSettings.isOpen = true;
        return;
      }
      this.searchSettings.isOpen = false;
      this.searchState.quickSearchQuery = '';
      var results: SearchResultsViewModel = await lastValueFrom(this.searchService.doPowerSearch(filterItems, pageNumber, this.searchSettings.powerSearchCount));
      if(!results?.items.length){
        this.toastr.info('No search results');
        return;
      }
      this.searchFilter.isOpen = false;
      this.showSearchResults(results, 'power', 1);
      this.searchState.quickSearchQuery = '';
      for(var item of this.searchRecords.searchResults.items){
        try{
          var imageBlob:Blob = await lastValueFrom(this.searchService.loadThumbnailById(item.pictureID));
          item.imgSrc = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        }
        catch(err){
          // Swallow and move on to the next one
          item.imgSrc = 'ERROR';
        }
      }
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
  }
  async view(item: SearchResultItemViewModel, modalForView: TemplateRef<any>): Promise<void> {
    try{
      Object.assign(this.singleRecord, item);
      var imageBlob:Blob = await lastValueFrom(this.searchService.loadFullSizeImageById(item.pictureID));
      var url = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
      this.singleRecord.fullSizeImgSrc = url;
    }
    catch(err){
      this.singleRecord.fullSizeImgSrc = '';
      this.toastr.warning('Failed to load image. Showing metadata only');
    }
    finally{
      this.openModal(modalForView);
    }
  }
  edit(item: SearchResultItemViewModel, modalForWrite: TemplateRef<any>): void{ 
    Object.assign(this.editSingleRecord.data, item);
    this.editSingleRecord.rawDateInput = new Date(`${item.Month}-${item.Day}-${item.Year}`);
    this.openModal(modalForWrite);
  }
  editsSaved(item: SearchResultItemViewModel): void{
    var index: number = this.searchRecords.searchResults.items.findIndex(x => x.pictureID === item.pictureID)
    this.searchRecords.searchResults.items[index] = item;
    this.modalRef.hide();
  }
  async download(item: SearchResultItemViewModel): Promise<void> {
    try{
      var imageBlob:Blob = await lastValueFrom(this.searchService.loadFullSizeImageById(item.pictureID, true));
      var url:string = window.URL.createObjectURL(imageBlob); // Will be revoked, no need to sanitize
      var a:HTMLAnchorElement = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = item.File
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
    catch(err){
        this.toastr.error('Something went wrong');
    }
  }
  async delete(item: SearchResultItemViewModel): Promise<void> {
    try{
      this.modalRef.hide();
      await lastValueFrom(this.searchService.deleteById(item.pictureID));
      this.toastr.info('Deleted');
      var index: number = this.searchRecords.searchResults.items.findIndex(x => x.pictureID === item.pictureID)
      this.searchRecords.searchResults.items.splice(index, 1);
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
  }
  openModal(template: TemplateRef<any>): void {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, {
      class: 'modal-xl'
    });
  }
  openSetting(): void {
    this.searchSettings.isOpen = true;
  }
  settingsSubmit(settings: SearchSettingsViewModel): void {
    this.searchSettings = Object.assign({}, settings);
    this.searchSettings.isOpen = false;
  }
  async autoSuggest(pageNumber: number = 1): Promise<void> {
    try{
      if(!this.searchSettings.enableAutoSuggest || this.searchState.quickSearchQuery.length < 5)
        return;
      // Manual debounce implementation - user stopped typing. Consider using a reactive control instead
      let temp = this.searchState.quickSearchQuery;
      await new Promise((r) => { 
        setTimeout(r, 300)
      })
      if(temp !== this.searchState.quickSearchQuery)
        return;
      var results: SearchResultsViewModel = await lastValueFrom(this.searchService.doQuickSearch(this.searchState.quickSearchQuery, pageNumber, this.searchSettings.suggestCount));
      if(!results?.items.length){
        this.searchRecords.searchResults.items = [];
        return;
      }
      this.showSearchResults(results, 'autosuggest', pageNumber);
      for(var item of this.searchRecords.searchResults.items){
        try{
          var imageBlob:Blob = await lastValueFrom(this.searchService.loadThumbnailById(item.pictureID));
          item.imgSrc = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        }
        catch(err){
          // Swallow and move on to the next one
          item.imgSrc = 'ERROR';
        }
      }
    }
    catch(err){
      this.toastr.warning('Unable to suggest. Try quick/power search')
    }
  }
  async filter(pageNumber: number = 1): Promise<void> {
    var searchType: SearchType = 'custom';
    let customSearchFilters: SearchFilterItem[] = [];
    this.addFilterIfNeeded('RR', customSearchFilters);
    this.addFilterIfNeeded('Month', customSearchFilters);
    this.addFilterIfNeeded('Day', customSearchFilters);
    this.addFilterIfNeeded('Year', customSearchFilters);
    this.addFilterIfNeeded('ID', customSearchFilters);
    this.addFilterIfNeeded('Location', customSearchFilters);
    this.addFilterIfNeeded('State', customSearchFilters);
    this.addFilterIfNeeded('Equipment', customSearchFilters);
    this.addFilterIfNeeded('Model', customSearchFilters);
    this.addFilterIfNeeded('Dir', customSearchFilters);
    this.addFilterIfNeeded('PhotographersName', customSearchFilters);
    this.addFilterIfNeeded('File', customSearchFilters);
    this.addFilterIfNeeded('ScanTech', customSearchFilters);
    this.addFilterIfNeeded('Owner', customSearchFilters);
    this.addFilterIfNeeded('Collection', customSearchFilters);
    this.addFilterIfNeeded('Published', customSearchFilters);
    this.addFilterIfNeeded('Notes', customSearchFilters);
    if(customSearchFilters.length)
      customSearchFilters[customSearchFilters.length - 1].nextItemLink = undefined;
    else
      searchType = 'quick';
    await this.doQuickSearch(customSearchFilters, pageNumber);
    this.searchState.searchType = searchType;
  }
  private addFilterIfNeeded(key: keyof typeof this.searchRecords.customSearchForm, customSearchFilters: SearchFilterItem[]): void {
    if(this.searchRecords.customSearchForm[key]) {
      // TO-DO: Consider refactor
      var compareValue:string = key;
      switch(key){
        case 'ScanTech':
          compareValue = 'Scan Tech';
          break;
        case 'Equipment':
          compareValue = 'Equipment #';
          break;
        case 'PhotographersName':
          compareValue = 'Photographer\'s Name';
          break;
      }
      customSearchFilters.push(
        new SearchFilterItem(this.searchFilter.criteriaOptions.find(x => x.maptext === compareValue)?.criteriaID, 1, this.searchRecords.customSearchForm[key], 'x')
      )
    }
  }
  async paginate(page: PaginateAction): Promise<void> {
    var currentPage:number = this.searchRecords.pagination.activeIndex + 1;
    if(currentPage === page)
      return;
    if(page === 'previous')
      currentPage--;
    else if(page === 'next')
      currentPage++;
    else
      currentPage = page;
    if(['quick', 'custom'].includes(this.searchState.searchType as string))
      await this.filter(currentPage)
    else if(this.searchState.searchType === 'power')
      await this.doPowerSearch(currentPage);
    else if(this.searchState.searchType === 'autosuggest')
      await this.autoSuggest(currentPage);
  }
}
