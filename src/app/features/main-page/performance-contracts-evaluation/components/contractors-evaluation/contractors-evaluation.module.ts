import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractorsEvaluationRoutingModule } from './contractors-evaluation-routing.module';
import { AddEditContractorsEvaluationComponent } from './add-edit-contractors-evaluation/add-edit-contractors-evaluation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { ContractorsEvaluationComponent } from './contractors-evaluation.component';

@NgModule({
  declarations: [
    ContractorsEvaluationComponent,
    AddEditContractorsEvaluationComponent,
  ],
  imports: [
    CommonModule,
    ContractorsEvaluationRoutingModule,
    BreadCrumbComponent,
    ListComponent,
    SweetAlertMessageComponent,
    NoDataYetComponent,
    ReactiveFormsModule,
    UploadFileComponent,
    DropdownModule,
    RatingModule
  ],
})
export class ContractorsEvaluationModule {}
