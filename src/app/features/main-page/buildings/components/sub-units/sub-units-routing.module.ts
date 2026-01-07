import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubUnitsComponent } from './sub-units.component';

const routes: Routes = [{ path: '', component: SubUnitsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubUnitsRoutingModule { }
