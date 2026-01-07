import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutgoingRequestsComponent } from './outgoing-requests.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';

const routes: Routes = [
  { path: '', component: OutgoingRequestsComponent },
  { path: 'request-details/:id', component: RequestDetailsComponent },
  { path: 'add', component: AddEditComponent },
  { path: 'edit/:id', component: AddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutgoingRequestsRoutingModule {}
