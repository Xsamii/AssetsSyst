import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenancePlanComponent } from './maintenance-plan.component';
import { AddEditMaintenancePlanComponent } from './add-edit-maintenance-plan/add-edit-maintenance-plan.component';

const routes: Routes = [{
  path:'',
  component:MaintenancePlanComponent
},
{
  path:'add',
  component:AddEditMaintenancePlanComponent
},
{
  path:'edit/:id',
  component:AddEditMaintenancePlanComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenancePlanRoutingModule { }
