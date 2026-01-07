import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsCategoriesComponent } from './projects-categories.component';

const routes: Routes = [{ path: '', component: ProjectsCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsCategoriesRoutingModule { }
