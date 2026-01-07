import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyDashboardRoutingModule } from './survey-dashboard-routing.module';
import { SurveyDashboardComponent } from './components/survey-dashboard/survey-dashboard.component';


@NgModule({
  declarations: [
    SurveyDashboardComponent
  ],
  imports: [
    CommonModule,
    SurveyDashboardRoutingModule
  ]
})
export class SurveyDashboardModule { }
