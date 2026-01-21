import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenancePlanRoutingModule } from './maintenance-plan-routing.module';
import { MaintenancePlanComponent } from './maintenance-plan.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { AddEditMaintenancePlanComponent } from './add-edit-maintenance-plan/add-edit-maintenance-plan.component';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [MaintenancePlanComponent, AddEditMaintenancePlanComponent],
  imports: [
    CommonModule,
    MaintenancePlanRoutingModule,
    BreadCrumbComponent,
        UploadFileComponent,
        ReactiveFormsModule,
        DropdownModule,
        SweetAlertMessageComponent,
        CalendarModule,
        ListComponent,AutoCompleteModule,FormsModule,NoDataYetComponent,
        MultiSelectModule
  ]
})
export class MaintenancePlanModule { }
