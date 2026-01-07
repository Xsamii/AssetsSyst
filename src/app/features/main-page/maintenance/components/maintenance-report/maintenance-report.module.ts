import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceReportRoutingModule } from './maintenance-report-routing.module';
import { MaintenanceReportComponent } from '../maintenance-report/maintenance-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { BreadCrumbReportComponent } from 'src/app/Shared/components/bread-crumb-report/bread-crumb-report.component';


@NgModule({
  declarations: [
    MaintenanceReportComponent
  ],
  imports: [
    CommonModule,
    MaintenanceReportRoutingModule,  BreadCrumbComponent,BreadCrumbReportComponent,
        UploadFileComponent,
        ReactiveFormsModule,
        DropdownModule,
        ListComponent
  ]
})
export class MaintenanceReportModule { }
