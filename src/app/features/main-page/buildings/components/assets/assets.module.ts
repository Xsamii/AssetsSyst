import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AssetsRoutingModule } from './assets-routing.module';
import { MaintenanceInspectionLogComponent } from './maintenance-inspection-log/maintenance-inspection-log.component';
import { ViewMaintenanceInspectionLogComponent } from './maintenance-inspection-log/view-maintenance-inspection-log/view-maintenance-inspection-log.component';
import { AddEditMaintenanceInspectionLogComponent } from './maintenance-inspection-log/add-edit-maintenance-inspection-log/add-edit-maintenance-inspection-log.component';
@NgModule({
  declarations: [  
    
  ],
  imports: [CommonModule, AssetsRoutingModule, HttpClientModule],
})
export class AssetsModule {}
