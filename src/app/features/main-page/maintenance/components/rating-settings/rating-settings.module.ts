import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingSettingsRoutingModule } from './rating-settings-routing.module';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditRatingComponent } from './components/add-edit-rating/add-edit-rating.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    RatingListComponent,
    AddEditRatingComponent
  ],
  imports: [
    CommonModule,
    RatingSettingsRoutingModule,
    NoDataYetComponent,
    BreadCrumbComponent,
    SweetAlertMessageComponent,
    ListComponent,
    ReactiveFormsModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule 
  ]
})
export class RatingSettingsModule { }
