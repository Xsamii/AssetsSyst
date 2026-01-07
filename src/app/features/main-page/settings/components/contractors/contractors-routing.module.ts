import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorsComponent } from './contractors.component';
import { AddEditContractorComponent } from './add-edit-contractor/add-edit-contractor.component';

const routes: Routes = [
  { path: '', component: ContractorsComponent },
  { path: 'add', component: AddEditContractorComponent },
  { path: 'edit/:id', component: AddEditContractorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorsRoutingModule {}
