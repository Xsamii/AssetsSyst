import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomingRequestsComponent } from './incoming-requests.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';

const routes: Routes = [
  { path: '', component: IncomingRequestsComponent },
  { path: 'request-details/:id', component: RequestDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingRequestsRoutingModule {}
