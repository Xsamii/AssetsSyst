import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { PiecesRoutingModule } from './pieces-routing.module';
import { PiecesAddEditComponent } from './pieces-add-edit/pieces-add-edit.component';
import { DetailsComponent } from './details/details.component';
@NgModule({
  declarations: [  
  ],
  imports: [CommonModule, PiecesRoutingModule, HttpClientModule],
})
export class PiecesModule { }
