import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartsRequestsComponent } from './parts-requests.component';
import { AddUpdatePartsComponent } from './components/add-update-parts/add-update-parts.component';
import { DetailsPartComponent } from './components/details-part/details-part.component';

const routes: Routes = [{
  path:"",
  component:PartsRequestsComponent
},
{
  path:"create",
  component:AddUpdatePartsComponent
},
{
  path:"create/:id",
  component:AddUpdatePartsComponent
},
{
  path:"update/:id",
  component:AddUpdatePartsComponent
},
{
  path:"details/:id",
  component:DetailsPartComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRequestsRoutingModule { }
