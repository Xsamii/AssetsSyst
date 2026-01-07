import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutgoingRequestsRoutingModule } from './outgoing-requests-routing.module';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { CalendarModule } from 'primeng/calendar';
import { TreeSelectModule } from 'primeng/treeselect';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';

@NgModule({
  declarations: [RequestDetailsComponent, AddEditComponent],
  imports: [
    CommonModule,
    OutgoingRequestsRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    BreadCrumbComponent,
    CalendarModule,
    TreeSelectModule,
    UploadFileComponent,
    SweetAlertMessageComponent,
  ],
})
export class OutgoingRequestsModule {}
