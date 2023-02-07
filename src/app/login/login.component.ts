import { Component, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LoginService } from './login.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email:any;
  password:any;
  modalRef: BsModalRef;
  constructor(private toastr: ToastrService,
    private loginService: LoginService,
    private modalService: BsModalService,
    private cookieService: CookieService) { 
    this.email = 'adriyaman@hotmail.com';
    //this.password = '1111';
    this.modalRef = new BsModalRef();
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {
      class: 'login-modal'
    });
  }

  async doLogin():Promise<void>{
    try{
      if(!this.email || !this.password){
        this.toastr.error('All fields are required');
        return;
      }
      var token: string = await lastValueFrom(this.loginService.doLogin(this.email, this.password));
      this.modalRef.hide();
      this.cookieService.set('jwt', token);
      this.loginService.authenticated();
    }
    catch(err){
      if(err instanceof HttpErrorResponse && [401, 403].includes((err as HttpErrorResponse).status))
        this.toastr.error(err.error)
      else
        this.toastr.error('Something went wrong');
    }
  }

}
