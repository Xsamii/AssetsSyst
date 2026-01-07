import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsMenuComponent } from './projects-menu.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: ProjectsMenuComponent,
    children: [
      {
        path: '',
        title: 'المشاريع',
        data: {
          role: [
            Roles.Admin,
            Roles.SystemOfficer,
            Roles.OfficeManager,
            Roles.ProjectManager,
            Roles.OfficeEmployee,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/projects-list/projects-list.module').then(
            (m) => m.ProjectsListModule
          ),
      },
      {
        path: 'projects-categories',
        title: 'التصنيفات',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/projects-categories/projects-categories.module'
          ).then((m) => m.ProjectsCategoriesModule),
      },
      {
        path: 'projects-status',
        title: 'الحالات',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/projects-status/projects-status.module').then(
            (m) => m.ProjectsStatusModule
          ),
      },
      {
        path: 'projects-tasks',
        title: 'المهام ',
        data: {
          role: [Roles.Admin, Roles.SystemOfficer],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/projects-tasks/projects-tasks.module').then(
            (m) => m.ProjectsTasksModule
          ),
      },
      {
        path: 'supervisory-task',
        title: 'المهام الإشرافية',
        data: {
          role: [Roles.OfficeManager, Roles.ProjectManager],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/supervisory-task/supervisory-task.module').then(
            (m) => m.SupervisoryTaskModule
          ),
      },
      {
        path: 'executive-task',
        title: 'المهام التنفيذية',
        data: {
          role: [Roles.OfficeManager, Roles.ProjectManager],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/executive-task/executive-task.module').then(
            (m) => m.ExecutiveTaskModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsMenuRoutingModule {}
