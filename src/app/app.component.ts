import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { LoginService } from './login/login.service';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordFormViewModel } from './vm/reset-password-form.view-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wrp-frontend';
  loggedInSubscription: Subscription;
  accessDeniedSubscription: Subscription;
  loggedIn: boolean = false;
  accessDenied: boolean = false;
  inProgressXhrCount: number = 0;
  modalRef: BsModalRef = new BsModalRef;
  resetPasswordForm:ResetPasswordFormViewModel = new ResetPasswordFormViewModel;
  constructor(private _cookieService:CookieService,
    private loginService: LoginService,
    private router: Router,
    private appService: AppService,
    private modalService: BsModalService,
    private toastrService:ToastrService){
    this.loggedInSubscription = this.loginService.getAuthState().subscribe((state) => {
      if(!state){
        this.router.navigate(['/login'])
        this._cookieService.deleteAll();
      }
      else if(!location.pathname || location.pathname === '/' || location.pathname === '/login') // ActivatedRoute is not available here, so use window.location
        this.router.navigate(['/search'])
      this.loggedIn = state;
    })
    this.accessDeniedSubscription = this.loginService.getAccessDenied().subscribe((show) => {
      this.accessDenied = show;
    })
    this.appService.httpEvent.subscribe((ev) => {
      if(this.inProgressXhrCount < 0) // Something is wrong. Reset. Typically this case will not be executed except in case of severe error
        this.inProgressXhrCount = 0;
      if(ev)
        this.inProgressXhrCount++;
      else
        this.inProgressXhrCount--;
    })
  }
  ngOnInit(): void {
    if(!this._cookieService.get('jwt'))
      this.loginService.challenge();
    else
      this.loginService.authenticated();
  }
  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {
      class: 'login-modal'
    });
  }
  async submitChangePassword():Promise<void>{
    if(this.resetPasswordForm.newPassword !== this.resetPasswordForm.newPasswordConfirm){
      this.toastrService.error('New passwords do not match');
      return;
    }
    if(!this.resetPasswordForm.oldPassword || !this.resetPasswordForm.newPassword || !this.resetPasswordForm.newPasswordConfirm){
      this.toastrService.error('All fields are mandatory');
      return;
    }
    try{
      await lastValueFrom(this.appService.changePassword(this.resetPasswordForm.oldPassword, this.resetPasswordForm.newPassword));
      this.toastrService.success('Saved successfully')
    }
    catch(err){
      console.log(err);
      if(err instanceof HttpErrorResponse && err.status === 403)
        this.toastrService.error(err.error)
      else
        this.toastrService.error('Something went wrong');
    }
    finally{
      this.modalRef.hide();
    }
  }
  async logout(){
    this.loginService.challenge();
  }
}
