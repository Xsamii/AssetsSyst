import { NgModule } from '@angular/core';

import { OnlyNumberDirective } from './only-number.directive';
import { HideFileDirective } from './hide-file.directive';
import { CachedSrcDirective } from 'src/app/Shared/components/geolocation-dialog/CachedSrcDirective.directive';



@NgModule({
  imports: [],
  declarations: [
    CachedSrcDirective,
    OnlyNumberDirective,
    HideFileDirective
  ],
  exports: [
    CachedSrcDirective,
    OnlyNumberDirective,
    HideFileDirective
  ]
})
export class DirectivesModule { }
