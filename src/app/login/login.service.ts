import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authState: Subject<boolean>;
  private accessDenied:Subject<boolean>;
  baseUrl:string;
  constructor(private httpClient: HttpClient) { 
    this.baseUrl = environment.API_URL + 'auth/';
    this.authState = new Subject<boolean>();
    this.accessDenied = new Subject<boolean>();
  }

  doLogin(email: string, password: string): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'login', {email,password}, {responseType: 'text'})
  }
  getCurrentUserPermissions(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.baseUrl + 'get-current-user-permissions');
  }
  getAccessDenied():Observable<boolean>{
    return this.accessDenied.asObservable();
  }
  challenge() {
    this.authState.next(false);
  }
  authenticated() {
    this.authState.next(true);
  }
  getAuthState() {
    return this.authState.asObservable();
  }
  denyAccess() {
    this.accessDenied.next(true);
  }
  grantAccess() {
    this.accessDenied.next(false);
  }
}
