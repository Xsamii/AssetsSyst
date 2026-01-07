import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsStatusComponent } from './projects-status.component';

const routes: Routes = [{ path: '', component: ProjectsStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsStatusRoutingModule { }
