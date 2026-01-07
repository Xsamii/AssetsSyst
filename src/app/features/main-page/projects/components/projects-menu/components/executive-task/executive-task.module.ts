import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveTaskRoutingModule } from './executive-task-routing.module';
import { ExecutiveTaskComponent } from './executive-task.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExecutiveTaskComponent],
  imports: [
    CommonModule,
    ExecutiveTaskRoutingModule,
    NoDataYetComponent,
    BreadCrumbComponent,
    ListComponent,
    DropdownModule,
    ReactiveFormsModule,
  ],
})
export class ExecutiveTaskModule {}
