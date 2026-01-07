import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from './projects-list.component';
import { ProjectsAddEditComponent } from './projects-add-edit/projects-add-edit.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
const Roles = UserTypesEnum;
const routes: Routes = [
  { path: '', component: ProjectsListComponent },
  {
    path: 'add',
    data: { role: [Roles.Admin, Roles.SystemOfficer] },
    canActivate: [AuthGuard],
    component: ProjectsAddEditComponent,
  },
  {
    path: 'edit/:id',
    data: { role: [Roles.Admin, Roles.SystemOfficer] },
    canActivate: [AuthGuard],
    component: ProjectsAddEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsListRoutingModule {}
