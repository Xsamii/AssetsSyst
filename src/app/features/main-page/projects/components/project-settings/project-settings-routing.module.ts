import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectSettingsComponent } from './project-settings.component';

const routes: Routes = [{ path: '', component: ProjectSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectSettingsRoutingModule { }
