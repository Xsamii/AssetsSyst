import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceContractsEvaluationRoutingModule } from './performance-contracts-evaluation-routing.module';
import { PerformanceContractsEvaluationComponent } from './performance-contracts-evaluation.component';


@NgModule({
  declarations: [
    PerformanceContractsEvaluationComponent
  ],
  imports: [
    CommonModule,
    PerformanceContractsEvaluationRoutingModule
  ]
})
export class PerformanceContractsEvaluationModule { }
