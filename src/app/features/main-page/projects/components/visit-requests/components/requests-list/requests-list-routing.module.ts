import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsListComponent } from './requests-list.component';
import { AddEditComponent } from '../outgoing-requests/components/add-edit/add-edit.component';
import { RequestDetailsComponent } from '../incoming-requests/components/request-details/request-details.component';

const routes: Routes = [
  { path: '', component: RequestsListComponent },
  { path: 'request-details/:id', component: RequestDetailsComponent },
  { path: 'add', component: AddEditComponent },
  { path: 'edit/:id', component: AddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsListRoutingModule {}
