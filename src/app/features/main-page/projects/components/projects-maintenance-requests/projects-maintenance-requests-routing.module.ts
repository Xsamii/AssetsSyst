import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsMaintenanceRequestsComponent } from './projects-maintenance-requests.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { DetailsComponent } from '../../../maintenance/components/maintenance-requests/components/details/details.component';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
const Roles = UserTypesEnum;
const routes: Routes = [
  { path: '', component: ProjectsMaintenanceRequestsComponent },
  {
    path: 'details/:id',
    data: {
      role: [Roles.OfficeManager, Roles.ProjectManager, Roles.OfficeEmployee],
    },
    canActivate: [AuthGuard],
    component: DetailsComponent,
  },
  // { path: 'projects-maintenance-requests', component: ProjectsMaintenanceRequestsComponent },

  // {
  //   path: 'projects-maintenance-requests/executive',

  //   component: ProjectsMaintenanceRequestsComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsMaintenanceRequestsRoutingModule {}
