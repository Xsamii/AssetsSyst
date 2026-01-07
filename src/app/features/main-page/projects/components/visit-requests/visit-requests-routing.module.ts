import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitRequestsComponent } from './visit-requests.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: VisitRequestsComponent,
    children: [
      {
        path: '',
        title: 'الطلبات',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/requests-list/requests-list.module').then(
            (m) => m.RequestsListModule
          ),
      },
      {
        path: 'incoming-requests',
        title: 'الطلبات الواردة',
        data: { role: [Roles.OfficeManager, Roles.ProjectManager] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/incoming-requests/incoming-requests.module'
          ).then((m) => m.IncomingRequestsModule),
      },
      {
        path: 'outgoing-requests',
        title: 'الطلبات الصادرة',
        data: { role: [Roles.OfficeManager, Roles.ProjectManager] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/outgoing-requests/outgoing-requests.module'
          ).then((m) => m.OutgoingRequestsModule),
      },
      {
        path: 'specified-requests',
        title: 'الطلبات المخصصة',
        data: {
          role: [
            Roles.Admin,
            Roles.SystemOfficer,
            Roles.ProjectManager,
            Roles.OfficeEmployee,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './components/specified-requests/specified-requests.module'
          ).then((m) => m.SpecifiedRequestsModule),
      },
      {
        path: 'requests-types',
        title: 'أنواع الطلبات',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/requests-types/requests-types.module').then(
            (m) => m.RequestsTypesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitRequestsRoutingModule {}
