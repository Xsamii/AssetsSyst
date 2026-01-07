import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { InventoryComponent } from './inventory/inventory.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { GeolocationDialogComponent } from 'src/app/Shared/components/geolocation-dialog/geolocation-dialog.component';
import { BuildingsmodelsComponent } from './maps/buildingsmodels/buildingsmodels.component';


@NgModule({
    declarations: [
    InventoryComponent, 
  ],
    imports: [
        CommonModule,
        MainPageRoutingModule,
        RouterModule,
    ]
})
export class MainPageModule { }
