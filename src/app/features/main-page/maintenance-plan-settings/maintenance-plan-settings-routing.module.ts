import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { MaintenancePlanSettingsComponent } from './maintenance-plan-settings.component';
import { MaintenacePlanMalfunctionTypesComponent } from './components/maintenace-plan-malfunction-types/maintenace-plan-malfunction-types.component';

const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: MaintenancePlanSettingsComponent,
    children: [
      { path: '', redirectTo: 'maintenace-plan', pathMatch: 'full' },
      // {
      //   path: 'maintenace-plan',
      //   title: 'خطة الصيانة',
      //   data: {
      //     role: [
      //       Roles.Admin,
      //       Roles.SystemOfficer,
      //     ],
      //   },
      //   canActivate: [AuthGuard],
      //   loadChildren: () =>
      //     import('./components/maintenance-plan/maintenance-plan.module').then(
      //       (m) => m.MaintenancePlanModule
      //     ),
      // },
      {
        path: 'maintenace-plan-malfunction-types',
        title: 'أنواع الأعطال',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        component: MaintenacePlanMalfunctionTypesComponent,
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
export class MaintenancePlanSettingsRoutingModule {}
