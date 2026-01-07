import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { NotificationsComponent } from './Shared/components/notifications/notifications.component';
import { ProfileComponent } from './Shared/components/profile/profile.component';
import { UserTypesEnum } from './core/enums/UserTypesEnum';
import { ProjectsReportsComponent } from './features/main-page/projects/components/reports/projects-reports/projects-reports.component';
import { RequestReportsComponent } from './features/main-page/projects/components/reports/request-reports/request-reports.component';
const Roles = UserTypesEnum;

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'auth',
        // data: { role: [1, 2, 3, 4, 5, 6, 7] },
        // canActivate: [AuthGuard],
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: '',
        //  data: { role: [1, 2, 3, 4, 5, 6, 7] },
        //  canActivate: [AuthGuard],
        loadChildren: () => import('./features/main-page/main-page.module').then(m => m.MainPageModule)
      },
      {
        path: 'ProjectsReports', component: ProjectsReportsComponent, title: ' تقرير المشاريع'
      },
      { path: 'RequestReports', component: RequestReportsComponent, title: ' تقرير الطلبات' },
      {
        path: 'maintenance-report',
        title: ' تقرير الصيانة',
        loadChildren: () =>
          import(
            './features/main-page/maintenance/components/maintenance-report/maintenance-report.module'
          ).then((m) => m.MaintenanceReportModule),
      },
     {
        path: 'survey',
        title: 'الاستبيان',
        loadChildren: () =>
          import('./features/main-page/survey/survey.module').then((m) => m.SurveyModule),
      },
    ],
      { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
