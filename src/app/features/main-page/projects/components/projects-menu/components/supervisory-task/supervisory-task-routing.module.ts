import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupervisoryTaskComponent } from './supervisory-task.component';

const routes: Routes = [{ path: '', component: SupervisoryTaskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisoryTaskRoutingModule { }
