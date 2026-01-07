import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { AddEditRatingComponent } from './components/add-edit-rating/add-edit-rating.component';

const routes: Routes = [
  {path: '', component: RatingListComponent},
  {path: 'add', component: AddEditRatingComponent},
  {path: 'edit/:id', component: AddEditRatingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingSettingsRoutingModule { }
