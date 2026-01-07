import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationSettingsRoutingModule } from './evaluation-settings-routing.module';
import { EvaluationSettingsComponent } from './evaluation-settings.component';
import { AddEditEvaluationSettingsComponent } from './add-edit-evaluation-settings/add-edit-evaluation-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContractorsRoutingModule } from '../../../settings/components/contractors/contractors-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { DirectivesModule } from "src/app/core/directives/directives.module";

@NgModule({
  declarations: [
    EvaluationSettingsComponent,
    AddEditEvaluationSettingsComponent,
  ],
  imports: [
    CommonModule,
    EvaluationSettingsRoutingModule,
    BreadCrumbComponent,
    ListComponent,
    SweetAlertMessageComponent,
    NoDataYetComponent,
    ReactiveFormsModule,
    UploadFileComponent,
    DropdownModule,
    DirectivesModule
],
})
export class EvaluationSettingsModule {}
