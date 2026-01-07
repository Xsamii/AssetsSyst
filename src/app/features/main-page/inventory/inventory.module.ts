import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { PiecesComponent } from './components/pieces/pieces.component';
import { PiecesCategoriesComponent } from './components/pieces-categories/pieces-categories.component';
import { PiecesRequestsComponent } from './components/pieces-requests/pieces-requests.component';


@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule
  ]
})
export class InventoryModule { }
