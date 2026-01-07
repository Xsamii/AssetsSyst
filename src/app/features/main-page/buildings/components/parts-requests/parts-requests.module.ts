import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartsRequestsRoutingModule } from './parts-requests-routing.module';
import { DetailsPartComponent } from './components/details-part/details-part.component';
import { AddUpdatePartsComponent } from './components/add-update-parts/add-update-parts.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { PartsRequestsComponent } from './parts-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  declarations: [
    DetailsPartComponent,
    // AddUpdatePartsComponent,
    PartsRequestsComponent,

  ],
  imports: [
    CommonModule,
    PartsRequestsRoutingModule,
    BreadCrumbComponent,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule, SweetAlertMessageComponent,
    CalendarModule,
    ListComponent,NoDataYetComponent,TabViewModule,TableModule,FileUploadModule,    UploadFileComponent,
    AutoCompleteModule,
    DirectivesModule,

  ]
})
export class PartsRequestsModule { }
