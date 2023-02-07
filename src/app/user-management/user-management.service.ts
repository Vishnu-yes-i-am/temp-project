import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PermissionViewModel } from '../vm/permission-view-model';
import { UserViewModel } from '../vm/user-view-model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  baseUrl:string = '';
  constructor(private httpClient: HttpClient) { 
    this.baseUrl = environment.API_URL + 'user-list/';
  }
  getPermissions(): Observable<PermissionViewModel[]> {
    return this.httpClient.get<PermissionViewModel[]>(this.baseUrl + 'user-permissions');
  }
  getUsers(): Observable<UserViewModel[]> {
    return this.httpClient.get<UserViewModel[]>(this.baseUrl);
  }
  toggleActiveState(id: number):Observable<any> {
    return this.httpClient.put(this.baseUrl + 'toggle-active-state/' + id, {}, { responseType: 'text' });
  }
  deleteUser(id: number):Observable<any> {
    return this.httpClient.delete(this.baseUrl + id, { responseType: 'text' });
  }
  updateUser(user: UserViewModel):Observable<any> {
    return this.httpClient.put(this.baseUrl, user, { responseType: 'text' });
  }
  generatePassword(user: UserViewModel): Observable<unknown> {
    return this.httpClient.put(this.baseUrl + 'password-reset/', user, { responseType: 'text' })
  }
  createUser(user: UserViewModel): Observable<string> {
    return this.httpClient.post(this.baseUrl, user, {responseType: 'text'});
  }
}
