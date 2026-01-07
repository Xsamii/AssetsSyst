import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecifiedRequestsComponent } from './specified-requests.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';

const routes: Routes = [
  { path: '', component: SpecifiedRequestsComponent },
  { path: 'request-details/:id', component: RequestDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecifiedRequestsRoutingModule {}
