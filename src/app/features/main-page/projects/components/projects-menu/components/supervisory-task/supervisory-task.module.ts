import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupervisoryTaskRoutingModule } from './supervisory-task-routing.module';
import { SupervisoryTaskComponent } from './supervisory-task.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { DropdownModule } from 'primeng/dropdown';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [SupervisoryTaskComponent],
  imports: [
    CommonModule,
    SupervisoryTaskRoutingModule,
    BreadCrumbComponent,
    ListComponent,
    DropdownModule,
    SweetAlertMessageComponent,
    NoDataYetComponent,
    ReactiveFormsModule,
    CheckboxModule,
  ],
})
export class SupervisoryTaskModule {}
