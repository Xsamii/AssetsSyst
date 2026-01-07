 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from 'src/app/Shared/components/profile/profile.component';
import { NotificationsComponent } from 'src/app/Shared/components/notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { InventoryComponent } from './inventory.component';
import { PiecesCategoriesComponent } from './components/pieces-categories/pieces-categories.component';
import { PiecesRequestsComponent } from './components/pieces-requests/pieces-requests.component';
const Roles = UserTypesEnum;
const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
      {
        path: 'pieces',
        title: 'القطع  ',
        data: { role: [Roles.Admin, Roles.SystemOfficer, Roles.inventoryManager] },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/pieces/pieces.module').then((m) => m.PiecesModule),
      },
      {
        path: 'pieces-categories',
        title: 'تصنيفات القطع',
        data: { role: [Roles.Admin, Roles.SystemOfficer, Roles.inventoryManager] },
        canActivate: [AuthGuard],
        component: PiecesCategoriesComponent,
      },

      {
        path: 'pieces-requests',
        title: 'الطلبات ',
        data: { role: [Roles.Admin, Roles.SystemOfficer, Roles.inventoryManager ] },
        canActivate: [AuthGuard],
        component: PiecesRequestsComponent,
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
export class InventoryRoutingModule {}
