import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorsEvaluationComponent } from './contractors-evaluation.component';
import { AddEditContractorsEvaluationComponent } from './add-edit-contractors-evaluation/add-edit-contractors-evaluation.component';

const routes: Routes = [
  {
    path: '',
    component: ContractorsEvaluationComponent,
  },
  {
    path: 'add',
    component: AddEditContractorsEvaluationComponent,
  },
  {
    path: 'edit/:id',
    component: AddEditContractorsEvaluationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorsEvaluationRoutingModule {}
