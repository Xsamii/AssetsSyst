import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        title: 'لوحة تحكم المشاريع',
        data: {
          role: [Roles.Admin, Roles.SystemOfficer , Roles.OfficeManager , Roles.ProjectManager],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/projects-dashboard/projects-dashboard.module'
          ).then((m) => m.ProjectsDashboardModule),
      },
      {
        path: 'projects-menu',
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
          import('./components/projects-menu/projects-menu.module').then(
            (m) => m.ProjectsMenuModule
          ),
      },
      {
        path: 'visit-requests',
        title: 'طلبات الزيارة',
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
        loadChildren: () =>
          import('./components/visit-requests/visit-requests.module').then(
            (m) => m.VisitRequestsModule
          ),
      },
      {
        path: 'projects-maintenance-requests',
        title: 'طلبات صيانة المشاريع',
        data: {
          role: [
            Roles.OfficeManager,
            Roles.ProjectManager,
            Roles.OfficeEmployee,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/projects-maintenance-requests/projects-maintenance-requests.module'
          ).then((m) => m.ProjectsMaintenanceRequestsModule),
      },

      {
        path: 'project-settings',
        title: 'إعدادات المشاريع',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/project-settings/project-settings.module').then(
            (m) => m.ProjectSettingsModule
          ),
      },
      {
        path: 'reports',
        title: ' التقارير',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
      { path: 'profile', component: ProfileComponent, title: 'الملف الشخصي' },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'الاشعارات',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
