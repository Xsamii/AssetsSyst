import { MaintenanceModule } from './maintenance/maintenance.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { BuildingsComponent } from './buildings/buildings.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { BuildingsDashboardComponent } from './buildings/components/buildings-dashboard/buildings-dashboard.component';
import { BuildingsmodelsComponent } from './maps/buildingsmodels/buildingsmodels.component';
import { MaintenanceMapComponent } from './maintenance/components/maintenance-map/maintenance-map.component';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: MainPageComponent,
        title: 'الصفحة الرئيسية',
      },
      { path: '', title: 'الصفحة الرئيسة', component: MainDashboardComponent },
      {path: 'dashboard', title: 'لوحة التحكم', component: MainDashboardComponent},
      {
        path: 'survey-dashboard',
        title: 'مؤشرات التقييم',
        loadChildren: () =>
          import('./survey-dashboard/survey-dashboard.module').then((m) => m.SurveyDashboardModule),
      },

      {
        path: 'settings',
        title: 'الإعدادات',
        data: { role: [Roles.Admin, Roles.SystemOfficer, Roles.OfficeManager] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
       {
        path: 'map',
        title: 'لوحة تحكم المباني',
        data: {
          role: [Roles.Admin,
          Roles.SystemOfficer,
          Roles.OfficeManager,
          Roles.ProjectManager,
          Roles.OfficeEmployee,
          Roles.ServiceRequester,
          Roles.MaintenanceSupervisor,],
        },
        canActivate: [AuthGuard],
        component: BuildingsDashboardComponent,
      },
      {
      path: 'buildings-models',
      title: 'التوزيع المكاني  3D',
      canActivate: [AuthGuard],
      component: BuildingsmodelsComponent,
      },
      {
        path: 'maintenance-map',
        title: 'الطلبات الموزعه علي الخريطة',
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
        component: MaintenanceMapComponent,
      },
      {
        path: 'inventory',
        title: 'المخزون',
        data: {
          role: [Roles.Admin, Roles.SystemOfficer, Roles.inventoryManager],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./inventory/inventory.module').then((m) => m.InventoryModule),
      },
      {
        path: 'projects',
        title: 'إدارة المشاريع ',
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
          import('./projects/projects.module').then((m) => m.ProjectsModule),
      },
      {
        path: 'buildings',
        title: 'إدارة الأصول',
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
          import('./buildings/buildings.module').then((m) => m.BuildingsModule),
      },
      {
        path: 'maintenance',
        title: 'إدارة الصيانة',
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
          import('./maintenance/maintenance.module').then((m) => m.MaintenanceModule),
      },
      {
        path: 'maintenance-plan-settings',
        title: 'إعدادات خطة الصيانة',
        data: {
          role: [Roles.Admin, Roles.SystemOfficer],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./maintenance-plan-settings/maintenance-plan-settings.module').then(
            (m) => m.MaintenancePlanSettingsModule
          ),
      },
      {
        path: 'performance-contracts-evaluation',
        title: 'تقييم عقود الأداء',
        data: {
          role: [Roles.Admin, Roles.SystemOfficer,Roles.MaintenanceSupervisor,],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./performance-contracts-evaluation/performance-contracts-evaluation.module').then(
            (m) => m.PerformanceContractsEvaluationModule
          ),
      },
      {
        path: 'monthly-report',
        title: '  التقرير الشهري',
        loadChildren: () =>
          import(
            './monthly-report/monthly-report.module'

          ).then((m) => m.MonthlyReportModule),
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
export class MainPageRoutingModule {}
