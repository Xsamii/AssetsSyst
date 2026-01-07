import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceReportComponent } from './maintenance-report.component';

const routes: Routes = [{
  path:'',
  component:MaintenanceReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceReportRoutingModule { }
