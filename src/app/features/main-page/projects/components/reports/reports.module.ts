import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ProjectsReportsComponent } from './projects-reports/projects-reports.component';
import { RequestReportsComponent } from './request-reports/request-reports.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import {  CalendarModule } from 'primeng/calendar';
import { TreeSelectModule } from 'primeng/treeselect';
import { FillterProjectComponent } from './fillter-project/fillter-project.component';
import { FillterRequestComponent } from './fillter-request/fillter-request.component';
import { BreadCrumbReportComponent } from 'src/app/Shared/components/bread-crumb-report/bread-crumb-report.component';

@NgModule({
  declarations: [ProjectsReportsComponent, RequestReportsComponent, FillterProjectComponent, FillterRequestComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    BreadCrumbComponent,
    UploadFileComponent,
    ReactiveFormsModule,
    DropdownModule,
    ListComponent,CalendarModule,TreeSelectModule,
    BreadCrumbReportComponent
  ],
})
export class ReportsModule {}
