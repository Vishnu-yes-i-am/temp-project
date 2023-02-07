import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from './login/login.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserManagementComponent } from './user-management/user-management.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Interceptor } from './interceptor/interceptor';
import { ImportComponent } from './import/import.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { SearchComponent } from './search/search.component';
import { SearchFilterFormComponent } from './search-filter-form/search-filter-form.component';
import { SearchRecordsComponent } from './search-records/search-records.component';
import { SingleRecordComponent } from './single-record/single-record.component';
import { ImageMetadataFormComponent } from './image-metadata-form/image-metadata-form.component';
import { EditSingleRecordComponent } from './edit-single-record/edit-single-record.component';
import { SearchSettingsFormComponent } from './search-settings-form/search-settings-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserManagementComponent,
    ImportComponent,
    DragDropDirective,
    SearchComponent,
    SearchFilterFormComponent,
    SearchRecordsComponent,
    SingleRecordComponent,
    ImageMetadataFormComponent,
    EditSingleRecordComponent,
    SearchSettingsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [
    ToastrService,
    LoginService,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    BsDropdownDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
