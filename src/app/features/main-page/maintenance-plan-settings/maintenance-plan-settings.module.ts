import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenancePlanSettingsRoutingModule } from './maintenance-plan-settings-routing.module';
import { MaintenancePlanSettingsComponent } from './maintenance-plan-settings.component';


@NgModule({
  declarations: [
    MaintenancePlanSettingsComponent
  ],
  imports: [
    CommonModule,
    MaintenancePlanSettingsRoutingModule
  ]
})
export class MaintenancePlanSettingsModule { }
