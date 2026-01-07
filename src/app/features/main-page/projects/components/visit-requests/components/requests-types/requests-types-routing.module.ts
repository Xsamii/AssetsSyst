import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsTypesComponent } from './requests-types.component';

const routes: Routes = [{ path: '', component: RequestsTypesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsTypesRoutingModule { }
