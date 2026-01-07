import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractorsRoutingModule } from './contractors-routing.module';
import { ContractorsComponent } from './contractors.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { AddEditContractorComponent } from './add-edit-contractor/add-edit-contractor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [ContractorsComponent, AddEditContractorComponent],
  imports: [
    CommonModule,
    ContractorsRoutingModule,
    BreadCrumbComponent,
    ListComponent,
    SweetAlertMessageComponent,
    NoDataYetComponent,
    ReactiveFormsModule,
    UploadFileComponent,
    DropdownModule
  ],
})
export class ContractorsModule {}
