import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceContractsEvaluationComponent } from './performance-contracts-evaluation.component';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: PerformanceContractsEvaluationComponent,
    children: [
      { path: '', redirectTo: 'evaluation-settings', pathMatch: 'full' },
      {
        path: 'evaluation-settings',
        title: 'إعدادات بنود التقييم',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/evaluation-settings/evaluation-settings.module').then(
            (m) => m.EvaluationSettingsModule
          ),
      },
      {
        path: 'contractors-evaluation',
        title: 'تقييم المقاولين',
        data: { role: [Roles.Admin, Roles.SystemOfficer,Roles.MaintenanceSupervisor,] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/contractors-evaluation/contractors-evaluation.module').then(
            (m) => m.ContractorsEvaluationModule
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
export class PerformanceContractsEvaluationRoutingModule {}
