import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSidebarComponent } from 'src/app/Shared/components/sidebars/main-sidebar/main-sidebar.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { KpiPointersComponent } from './components/kpi-pointers/kpi-pointers.component';

@NgModule({
  declarations: [  ],
  imports: [CommonModule, MaintenanceRoutingModule, MainSidebarComponent, BreadCrumbComponent, DropdownModule, ReactiveFormsModule],
})
export class MaintenanceModule { }
