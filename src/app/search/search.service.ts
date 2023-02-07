import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CriteriaOptionViewModel } from '../vm/criteria-options.view-model';
import { SearchFilterItem } from '../vm/search-filter-item.view-model';
import { SearchResultsViewModel } from '../vm/search-results.view-model';
import { SingleRecordViewModel } from '../vm/single-record.view-model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseUrl:string = environment.API_URL + 'search/';
  constructor(private httpClient:HttpClient) { }
  getCriteriaOptions(): Observable<CriteriaOptionViewModel[]> {
    return this.httpClient.get<CriteriaOptionViewModel[]>(this.baseUrl + 'criteria-options');
  }
  doQuickSearch(quickSearchQuery: string, pageNumber: number, limit: number, filterItems: SearchFilterItem[] = []): Observable<SearchResultsViewModel> {
    return this.httpClient.post<SearchResultsViewModel>(`${this.baseUrl}quick?q=${encodeURIComponent(quickSearchQuery)}&pageNumber=${pageNumber}&limit=${limit}`, filterItems);
  }
  doPowerSearch(filterItems: SearchFilterItem[], pageNumber: number, limit: number): Observable<SearchResultsViewModel> {
    return this.httpClient.post<SearchResultsViewModel>(`${this.baseUrl}power?pageNumber=${pageNumber}&limit=${limit}`, filterItems);
  }
  updateMetadata(data: SingleRecordViewModel): Observable<unknown> {
    return this.httpClient.put(this.baseUrl, data, {responseType: 'text'})
  }
  loadThumbnailById(pictureID: number): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}image?thumbnail=true&pictureID=${pictureID}`, {responseType: 'blob'})
  }
  loadFullSizeImageById(pictureID: number, download: boolean = false): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}image?pictureID=${pictureID}&download=${download}`, {responseType: 'blob'})
  }
  deleteById(pictureID: number): Observable<unknown> {
    return this.httpClient.delete(`${this.baseUrl}image?pictureID=${pictureID}`, {responseType: 'text'})
  }
}
