import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceContractsRoutingModule } from './maintenance-contracts-routing.module';
import { MaintenanceContractsComponent } from './maintenance-contracts.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { CalendarModule } from 'primeng/calendar';
import { GoogleMapsModule } from '@angular/google-maps';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [MaintenanceContractsComponent, AddEditComponent],
  imports: [
    CommonModule,
    MaintenanceContractsRoutingModule,
    NoDataYetComponent,
    BreadCrumbComponent,
    SweetAlertMessageComponent,
    ListComponent,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    GoogleMapsModule,
    UploadFileComponent,
    FileUploadModule,
    InputNumberModule,
  ],
})
export class MaintenanceContractsModule {}
