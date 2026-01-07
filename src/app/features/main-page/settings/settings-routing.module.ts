import { UsersModule } from './components/users/users.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { MunicipalitiesComponent } from './components/municipalities/municipalities.component';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        title: 'المستخدمين  ',
        data: { role: [Roles.Admin, Roles.SystemOfficer, Roles.OfficeManager] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'municipalities',
        title: 'البلديات',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        component: MunicipalitiesComponent,
      },
      {
        path: 'contractros',
        loadChildren: () =>
          import('./components/contractors/contractors.module').then(
            (m) => m.ContractorsModule
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
export class SettingsRoutingModule {}
