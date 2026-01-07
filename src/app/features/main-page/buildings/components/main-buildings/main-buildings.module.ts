import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainBuildingsRoutingModule } from './main-buildings-routing.module';
import { MainBuildingsAddEditComponent } from './main-buildings-add-edit/main-buildings-add-edit.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [],
  imports: [CommonModule, MainBuildingsRoutingModule, HttpClientModule],
})
export class MainBuildingsModule {}
