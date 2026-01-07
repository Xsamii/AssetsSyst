import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MalfunctionsTypesComponent } from './malfunctions-types.component';

const routes: Routes = [{ path: '', component: MalfunctionsTypesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MalfunctionsTypesRoutingModule { }
