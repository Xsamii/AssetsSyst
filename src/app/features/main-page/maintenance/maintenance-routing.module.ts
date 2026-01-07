import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { FillterMaintenanceComponent } from './components/fillter-maintenance/fillter-maintenance.component';

import { MaintenanceComponent } from './maintenance.component';
import { MaintenanceEvaluationTermsComponent } from '../settings/components/maintenance-evaluation-terms/maintenance-evaluation-terms.component';
import { KpiPointersComponent } from './components/kpi-pointers/kpi-pointers.component';

const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: MaintenanceComponent,
    children: [
      // {
      //   path: '',
      //   title: 'لوحة تحكم المباني',
      //   data: {
      //     role: [Roles.Admin,
      //     Roles.SystemOfficer,
      //     Roles.OfficeManager,
      //     Roles.ProjectManager,
      //     Roles.OfficeEmployee,
      //     Roles.ServiceRequester,
      //     Roles.MaintenanceSupervisor,],
      //   },
      //   canActivate: [AuthGuard],
      //   loadChildren: () =>
      //     import(
      //       './components/buildings-dashboard/buildings-dashboard.module'
      //     ).then((m) => m.BuildingsDashboardModule),
      // },

      {
        path: 'parts-requests',
        title: 'طلبات القطع',
        // data: {
        //   role: [
        //     Roles.Admin,
        //     Roles.SystemOfficer,
        //     Roles.OfficeManager,
        //     Roles.ProjectManager,
        //     Roles.OfficeEmployee,
        //     Roles.ServiceRequester,
        //     Roles.MaintenanceSupervisor,
        //   ],
        // },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../buildings/components/parts-requests/parts-requests.module'
          ).then((m) => m.PartsRequestsModule),
      },
      {
        path: 'evaluation-terms',
        title: 'بنود تقييم الصيانة',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        component: MaintenanceEvaluationTermsComponent,
      },
      {
        path: 'pointers',
        title: 'المؤشرات',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        component: KpiPointersComponent,
      },


      {
        path: 'maintenance-contracts',
        title: 'عقود الصيانة',
        data: {
          role: [Roles.Admin, Roles.SystemOfficer],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/maintenance-contracts/maintenance-contracts.module'
          ).then((m) => m.MaintenanceContractsModule),
      },
      {
        path: 'maintenace-requests',
        title: 'طلبات صيانة المباني',
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
          import(
            './components/maintenance-requests/maintenance-requests.module'
          ).then((m) => m.MaintenanceRequestsModule),
      },
      {
        path: 'rating-settings',
        title: 'اعدادات مؤشرات التقيييم',
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
          import(
            './components/rating-settings/rating-settings.module'
          ).then((m) => m.RatingSettingsModule),
      },
      {
        path: 'malfunctions-types',
        title: 'أنواع الأعطال',
        data: { role: [Roles.Admin, Roles.SystemOfficer, Roles.ProjectManager] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/malfunctions-types/malfunctions-types.module'
          ).then((m) => m.MalfunctionsTypesModule),
      },
      {
        path: 'fillter-maintenance',
        title: ' تصفية تقرير الصيانة',
        component: FillterMaintenanceComponent
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
export class MaintenanceRoutingModule { }
