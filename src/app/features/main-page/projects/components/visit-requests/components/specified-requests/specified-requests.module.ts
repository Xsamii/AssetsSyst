import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecifiedRequestsRoutingModule } from './specified-requests-routing.module';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { FileUploadModule } from 'primeng/fileupload';
@NgModule({
  declarations: [RequestDetailsComponent],
  imports: [
    CommonModule,
    SpecifiedRequestsRoutingModule,
    DropdownModule,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    UploadFileComponent,
    FileUploadModule,
  ],
})
export class SpecifiedRequestsModule {}
