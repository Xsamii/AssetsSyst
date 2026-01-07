import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyDashboardComponent } from './components/survey-dashboard/survey-dashboard.component';

const routes: Routes = [
  {path: '', component: SurveyDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyDashboardRoutingModule { }
