import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl:string = environment.API_URL;
  httpEvent: Subject<boolean>;
  constructor(private http:HttpClient) { 
    this.httpEvent = new Subject;
  }
  changePassword(oldPassword: string, newPassword: string):Observable<any> {
    return this.http.post(`${this.baseUrl}auth/changePassword`, {oldPassword, newPassword})
  }
}
