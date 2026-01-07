import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildingsRoutingModule } from './buildings-routing.module';
import { MainSidebarComponent } from 'src/app/Shared/components/sidebars/main-sidebar/main-sidebar.component';
import { FillterMaintenanceComponent } from '../maintenance/components/fillter-maintenance/fillter-maintenance.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [

    FillterMaintenanceComponent,


  ],
  imports: [CommonModule, BuildingsRoutingModule, MainSidebarComponent, BreadCrumbComponent, DropdownModule, ReactiveFormsModule],
})
export class BuildingsModule { }
