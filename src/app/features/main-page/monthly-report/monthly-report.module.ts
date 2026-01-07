import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyReportRoutingModule } from './monthly-report-routing.module';
import { MainTabComponent } from './main-tab/main-tab.component';
import { SubTabComponent } from './sub-tab/sub-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';



@NgModule({
  declarations: [ 
    MainTabComponent
  ],
  imports: [
    CommonModule,
    MonthlyReportRoutingModule,
     BreadCrumbComponent, DropdownModule, ReactiveFormsModule, FormsModule,            
  ]
})
export class MonthlyReportModule { }
