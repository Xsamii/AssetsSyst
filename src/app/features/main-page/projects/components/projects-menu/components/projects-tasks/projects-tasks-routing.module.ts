import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsTasksComponent } from './projects-tasks.component';

const routes: Routes = [{ path: '', component: ProjectsTasksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsTasksRoutingModule { }
