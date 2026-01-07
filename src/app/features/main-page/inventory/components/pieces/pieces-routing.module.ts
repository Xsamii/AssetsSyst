import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiecesComponent } from './pieces.component';
import { PiecesAddEditComponent } from './pieces-add-edit/pieces-add-edit.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: PiecesComponent },
  { path: 'add', component: PiecesAddEditComponent },
  { path: 'edit/:id', component: PiecesAddEditComponent },
  { path: 'details/:id', component: DetailsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PiecesRoutingModule {}
