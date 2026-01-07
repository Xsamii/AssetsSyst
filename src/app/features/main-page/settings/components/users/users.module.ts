import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { UseresRoutingModule } from './users-routing.module';
@NgModule({
  declarations: [],
  imports: [CommonModule, UseresRoutingModule, HttpClientModule],
})
export class UsersModule { }
