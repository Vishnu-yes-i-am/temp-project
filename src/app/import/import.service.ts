import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  baseUrl:string = '';
  constructor(private httpClient: HttpClient) { 
    this.baseUrl = environment.API_URL + 'import/';
  }
  validateAccess():Observable<any> {
    return this.httpClient.get(this.baseUrl + 'access', { responseType: 'text' });
  }
  doImport(formData: FormData):Observable<any> {
    return this.httpClient.post(this.baseUrl, formData, { responseType: 'text' });
  }
  parseFile(formData: FormData) {
    return this.httpClient.post(this.baseUrl + 'parse', formData)
  }
}
