import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationSettingsComponent } from './evaluation-settings.component';
import { AddEditEvaluationSettingsComponent } from './add-edit-evaluation-settings/add-edit-evaluation-settings.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationSettingsComponent,
  },
  {
    path: 'add',
    component: AddEditEvaluationSettingsComponent,
  },
  {
    path: 'edit/:id',
    component: AddEditEvaluationSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationSettingsRoutingModule {}
