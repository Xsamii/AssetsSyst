import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRequestsRoutingModule } from './maintenance-requests-routing.module';
import { AddEditMaintenanceComponent } from './components/add-edit-maintenance/add-edit-maintenance.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { DetailsComponent } from './components/details/details.component';
import { CalendarModule } from 'primeng/calendar';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { GeoLoctionComponent } from 'src/app/Shared/components/geo-loction/geo-loction.component';

@NgModule({
  declarations: [AddEditMaintenanceComponent, DetailsComponent , ],
  imports: [
    CommonModule,
    MaintenanceRequestsRoutingModule,
    BreadCrumbComponent,
    UploadFileComponent,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    SweetAlertMessageComponent,
    CalendarModule,
    ListComponent,
    AutoCompleteModule,
    FormsModule,
    GeoLoctionComponent
  ],
})
export class MaintenanceRequestsModule {}
