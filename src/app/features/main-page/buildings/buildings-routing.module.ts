import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingsComponent } from './buildings.component';
import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { FillterMaintenanceComponent } from '../maintenance/components/fillter-maintenance/fillter-maintenance.component';
import { AssetsTypesComponent } from './components/assets-types/assets-types.component';
import { OfficesComponent } from './components/offices/offices.component';
import { FloorsComponent } from './components/floors/floors.component';
import { AssetMainCategoryComponent } from './components/asset-main-category/asset-main-category.component';
import { AssetSubCategoryComponent } from './components/asset-sub-category/asset-sub-category.component';
import { SitesComponent } from './components/sites/sites.component';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: BuildingsComponent,
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
        path: 'main-buildings',
        title: 'المباني',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/main-buildings/main-buildings.module').then(
            (m) => m.MainBuildingsModule
          ),
      },
      {
        path: 'sub-units',
        title: 'المباني الفرعية',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/sub-units/sub-units.module').then(
            (m) => m.SubUnitsModule
          ),
      },













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
            './components/parts-requests/parts-requests.module'
          ).then((m) => m.PartsRequestsModule),
      },
      {
        path: 'assets-types',
        title: 'أنواع الأعطال',
        component: AssetsTypesComponent
      },
      {
        path: 'assets-main-categories',
        title: 'التصنيفات الرئيسية',
        component: AssetMainCategoryComponent
      },
      {
        path: 'assets-sub-categories',
        title: 'التصنيفات الفرعية',
        component: AssetSubCategoryComponent
      },
      {
        path: 'offices',
        title: 'الغرف',
        component: OfficesComponent
      },
      {
        path: 'sites',
        title: 'المواقع',
        component: SitesComponent
      },
      {
        path: 'floors',
        title: 'الطوابق',
        component: FloorsComponent
      },

      {
        path: 'assets',
        title: 'الأصول',
        data: { role: [Roles.Admin, Roles.SystemOfficer] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/assets/assets.module').then(
            (m) => m.AssetsModule
          ),
      },

      {
        path: 'buildings-settings',
        title: 'إعدادات المباني',
        loadChildren: () =>
          import(
            './components/buildings-settings/buildings-settings.module'
          ).then((m) => m.BuildingsSettingsModule),
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
export class BuildingsRoutingModule { }
