import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceContractsComponent } from './maintenance-contracts.component';
import { AddEditComponent } from './add-edit/add-edit.component';

const routes: Routes = [
  { path: '', component: MaintenanceContractsComponent },

  {
    path: 'add',

    component: AddEditComponent,
  },
  {
    path: 'edit/:id',
    component: AddEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceContractsRoutingModule {}
