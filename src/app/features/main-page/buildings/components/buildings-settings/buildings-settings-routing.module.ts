import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingsSettingsComponent } from './buildings-settings.component';

const routes: Routes = [{ path: '', component: BuildingsSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingsSettingsRoutingModule { }
