import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingsDashboardComponent } from './buildings-dashboard.component';

const routes: Routes = [{ path: '', component: BuildingsDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingsDashboardRoutingModule { }
