import { Component, OnInit } from '@angular/core';
import { UserViewModel } from '../vm/user-view-model';
import { PermissionViewModel } from '../vm/permission-view-model';
import { UserManagementService } from './user-management.service';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonStateViewModel } from '../vm/button-state-view-model';
import { UserSearchViewModel } from '../vm/user-search-view-model';
import { ToggleActiveStateButtonStateViewModel } from '../vm/toggle-active-state-button-state.view-model';
import { JsonService } from '../shared-services/json.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  title: string = '';
  users: UserViewModel[] = [];
  filteredUsers: UserViewModel[] = [];
  permissions: PermissionViewModel[] = [];
  selectedUser: UserViewModel = new UserViewModel;
  activeStateButton: ToggleActiveStateButtonStateViewModel;
  deleteButtonState: ButtonStateViewModel;
  saveButtonState: ButtonStateViewModel;
  resetPasswordButtonState: ButtonStateViewModel;
  search: UserSearchViewModel = new UserSearchViewModel;
  constructor(private userManagementService: UserManagementService,
      private loginService:LoginService,
      private router: Router, 
      public toastr: ToastrService,
      private jsonService:JsonService) { 
        this.activeStateButton = new ToggleActiveStateButtonStateViewModel()
        this.deleteButtonState = new ButtonStateViewModel("Delete");
        this.saveButtonState = new ButtonStateViewModel("Create User");
        this.resetPasswordButtonState = new ButtonStateViewModel("Reset Password")
  }

  async ngOnInit(): Promise<void> {
    try{
      await this.getPermissions();
      await this.getUsers();
      this.loginService.grantAccess();
      this.createMode();
    }
    catch(err){
      if(err instanceof HttpErrorResponse && err.status === 403)
        this.loginService.denyAccess();
      else
        this.toastr.error('Something went wrong')
    }
  }
  async getUsers():Promise<void> {
    this.users = await lastValueFrom(this.userManagementService.getUsers());
    this.filteredUsers = this.users;// TO-DO: Check for shallow copy
  }
  async getPermissions():Promise<void> {
    this.permissions = await lastValueFrom(this.userManagementService.getPermissions())
  }

  selectUser(user: UserViewModel = new UserViewModel):void{
    this.deSelectAll(this.filteredUsers);
    this.deSelectAll(this.users);
    user.isSelected = true;
    this.selectedUser = this.jsonService.shallowCopy(user);
    if(user.isActive)
      this.activeStateButton.deactivateState();
    else
      this.activeStateButton.activateState()
    if(user.id > 0)
      this.editMode();
    else
      this.createMode();
  }
  deSelectAll(list: UserViewModel[]):void{
    list.forEach((v) => {
      v.isSelected = false;
    })
  }
  async toggleActiveState(): Promise<void>{
    try{
      if(this.selectedUser.id < 0){
        this.toastr.error('Please pick an user first');
        return;
      }
      this.activeStateButton.setLoading();
      await lastValueFrom(this.userManagementService.toggleActiveState(this.selectedUser.id));
      this.selectedUser.isActive = !this.selectedUser.isActive;
      if(this.selectedUser.isActive)
        this.activeStateButton.deactivateState();
      else
        this.activeStateButton.activateState();
      this.toastr.success('Saved successfully')
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
    finally{
      this.activeStateButton.removeLoading();
      this.editMode();
    }
  }
  async deleteUser(): Promise<void>{
    try{
      if(this.selectedUser.id < 0){
        this.toastr.error('Please pick an user first');
        return;
      }
      this.deleteButtonState.setLoading();
      await lastValueFrom(this.userManagementService.deleteUser(this.selectedUser.id));
      this.toastr.success('Saved successfully')
      this.users.splice(this.users.indexOf(this.selectedUser), 1);
      this.filteredUsers.splice(this.filteredUsers.indexOf(this.selectedUser), 1);
      this.selectedUser = new UserViewModel();
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
    finally{
      this.deleteButtonState.removeLoading();
      this.createMode();
    }
  }
  togglePermission(permissionId: number): void{
    if(!this.selectedUser.permissions.includes(permissionId))
      this.selectedUser.permissions.push(permissionId);
    else
      this.selectedUser.permissions.splice(this.selectedUser.permissions.indexOf(permissionId), 1);
    this.selectedUser.permissions.sort((a, b) => a - b);
  }
  async submitForm(): Promise<void>{
    try{
      if(!this.selectedUser.email || !this.selectedUser.username){
        this.toastr.error("Username and email are required");
        return;
      }
      this.saveButtonState.setLoading();
      if(this.selectedUser.id < 0)
        await this.createUser();
      else {
        await lastValueFrom(this.userManagementService.updateUser(this.selectedUser))
        var updatedUserIndex:number = this.users.findIndex(x => x.id === this.selectedUser.id);
        this.users[updatedUserIndex] = this.jsonService.shallowCopy(this.selectedUser);
        if(this.users.length > this.filteredUsers.length) //search is active, filter results again
          this.doSearch();
      }
      this.toastr.success('Saved successfully')
    }
    catch(err){
      if(err instanceof HttpErrorResponse && err.status === 400 && typeof err.error === 'string')
        this.toastr.error(err.error)
      else
        this.toastr.error('Something went wrong')
    }
    finally{
      this.saveButtonState.removeLoading();
      this.editMode();
    }
  }
  doSearch():void{
    this.filteredUsers = this.users.filter(x => x.username.toLocaleLowerCase().includes(this.search.searchQuery.toLowerCase()) || x.email.toLowerCase().includes(this.search.searchQuery.toLowerCase()));
    this.selectUser(this.filteredUsers[0]);
  }
  exitSearch():void{
    this.search.show = false;
    this.filteredUsers = this.users;
    this.selectUser(this.filteredUsers[0]);
  }
  createMode():void{
    this.saveButtonState.removeLoading();
    this.title = "Create New User";
  }
  editMode():void{
    this.saveButtonState.text = 'Save Changes';
    this.title = this.selectedUser.username + "'s Properties";
  }
  async generatePassword():Promise<void>{
    try{
      if(this.selectedUser.id < 0){
        this.toastr.error('Please pick an user first');
        return
      }
      this.resetPasswordButtonState.setLoading();
      await lastValueFrom(this.userManagementService.generatePassword(this.selectedUser));
      this.resetPasswordButtonState.removeLoading();
      this.toastr.success('New password generated and mailed to user');
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
  }
  async createUser():Promise<void>{
    this.selectedUser.id = parseInt(await lastValueFrom(this.userManagementService.createUser(this.selectedUser)));
    this.users.push(this.selectedUser);
    if(this.users.length > this.filteredUsers.length) //search is active, filter results again
      this.doSearch();
    this.selectUser(this.selectedUser);
  }
  onKeyUp(ev:KeyboardEvent){
    if(['Enter', 'NumpadEnter'].includes(ev.code))
      this.doSearch();
  }
  clearSearch(){
    this.search.searchQuery = '';
    this.doSearch();
  }
}
