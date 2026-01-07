import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomingRequestsRoutingModule } from './incoming-requests-routing.module';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
@NgModule({
  declarations: [RequestDetailsComponent],
  imports: [
    CommonModule,
    IncomingRequestsRoutingModule,
    BreadCrumbComponent,
    DropdownModule,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
  ],
})
export class IncomingRequestsModule {}
