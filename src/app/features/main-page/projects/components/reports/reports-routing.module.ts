import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsReportsComponent } from './projects-reports/projects-reports.component';
import { RequestReportsComponent } from './request-reports/request-reports.component';
import { FillterProjectComponent } from './fillter-project/fillter-project.component';
import { FillterRequestComponent } from './fillter-request/fillter-request.component';

const routes: Routes = [
  // { path: 'ProjectsReports', component: ProjectsReportsComponent ,  title: ' تقرير المشاريع'     
  // },
  // { path: 'RequestReports', component: RequestReportsComponent ,title: ' تقرير الطلبات'},
  { path: 'fillterReports', component: FillterProjectComponent , title: ' تقرير المشاريع'},
  { path: 'fillterRequest', component: FillterRequestComponent ,title: ' تقرير الطلبات'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
