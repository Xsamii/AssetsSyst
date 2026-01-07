import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsDetailsComponent } from './assets-details/assets-details.component';
import { AssetsComponent } from './assets.component';
import { AssetsAddEditComponent } from './assets-add-edit/assets-add-edit.component';
import { MaintenanceLogForAssetComponent } from './maintenance-log-for-asset/maintenance-log-for-asset.component';
import { ViewmaintenanceLogForAssetComponent } from './maintenance-log-for-asset/viewmaintenance-log-for-asset/viewmaintenance-log-for-asset.component';
import { MaintenanceInspectionLogComponent } from './maintenance-inspection-log/maintenance-inspection-log.component';
import { ViewMaintenanceInspectionLogComponent } from './maintenance-inspection-log/view-maintenance-inspection-log/view-maintenance-inspection-log.component';
import { AddEditMaintenanceInspectionLogComponent } from './maintenance-inspection-log/add-edit-maintenance-inspection-log/add-edit-maintenance-inspection-log.component';

const routes: Routes = [
  { path: '', component: AssetsComponent },
  { path: 'add', component: AssetsAddEditComponent },
  { path: 'edit/:id', component: AssetsAddEditComponent },
  { path: 'details/:id', component: AssetsDetailsComponent },
  {
    path: 'maintenance-log-for-asset/:id/:assetName',
    component: MaintenanceLogForAssetComponent,
    title: 'سجل الصيانة للأصل',
  },
  {
    path: 'maintenance-log-view/:id',
    component: ViewmaintenanceLogForAssetComponent,
  },

  {
    path: 'maintenance-inspection-log/:id/:assetName',
    component: MaintenanceInspectionLogComponent,
  },
  {
    path: 'maintenance-inspection-log-view/:id',
    component: ViewMaintenanceInspectionLogComponent,
  },
  {
    path: 'add-maintenance-inspection-log',
    component: AddEditMaintenanceInspectionLogComponent,
  },
  {
    path: 'edit-maintenance-inspection-log/:id',
    component: AddEditMaintenanceInspectionLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
