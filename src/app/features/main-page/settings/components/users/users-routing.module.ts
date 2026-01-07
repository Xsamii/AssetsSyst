import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'add', component: UsersAddEditComponent },
  { path: 'edit/:id', component: UsersAddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseresRoutingModule {}
