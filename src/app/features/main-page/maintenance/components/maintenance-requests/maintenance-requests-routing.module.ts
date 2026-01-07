import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceRequestsComponent } from './maintenance-requests.component';
import { AddEditMaintenanceComponent } from './components/add-edit-maintenance/add-edit-maintenance.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { DetailsComponent } from './components/details/details.component';
const Roles = UserTypesEnum;
const routes: Routes = [
  { path: '', component: MaintenanceRequestsComponent },

  {
    path: 'add',
    data: {
      role: [
        Roles.Admin,
        Roles.SystemOfficer,
        Roles.ServiceRequester,
        Roles.MaintenanceSupervisor,
      ],
    },
    canActivate: [AuthGuard],
    component: AddEditMaintenanceComponent,
  },
  {
    path: 'addFromAssets/:assetId',
    data: {
      role: [
        Roles.Admin,
        Roles.SystemOfficer,
        Roles.ServiceRequester,
        Roles.MaintenanceSupervisor,
      ],
    },
    canActivate: [AuthGuard],
    component: AddEditMaintenanceComponent,
  },
  {
    path: 'edit/:id',
    data: {
      role: [
        Roles.Admin,
        Roles.SystemOfficer,
        Roles.ServiceRequester,
        Roles.MaintenanceSupervisor,
      ],
    },
    canActivate: [AuthGuard],
    component: AddEditMaintenanceComponent,
  },
  {
    path: 'details/:id',
    data: {
      role: [
        Roles.Admin,
        Roles.SystemOfficer,
        Roles.OfficeManager,
        Roles.ProjectManager,
        Roles.OfficeEmployee,
        Roles.ServiceRequester,
        Roles.MaintenanceSupervisor,
      ],
    },
    canActivate: [AuthGuard],
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRequestsRoutingModule {}
