import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutiveTaskComponent } from './executive-task.component';

const routes: Routes = [{ path: '', component: ExecutiveTaskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveTaskRoutingModule { }
