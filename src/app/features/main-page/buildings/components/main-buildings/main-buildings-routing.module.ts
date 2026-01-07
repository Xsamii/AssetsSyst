import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBuildingsComponent } from './main-buildings.component';
import { MainBuildingsAddEditComponent } from './main-buildings-add-edit/main-buildings-add-edit.component';

const routes: Routes = [
  { path: '', component: MainBuildingsComponent },
  { path: 'add', component: MainBuildingsAddEditComponent },
  { path: 'edit/:id', component: MainBuildingsAddEditComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainBuildingsRoutingModule { }
