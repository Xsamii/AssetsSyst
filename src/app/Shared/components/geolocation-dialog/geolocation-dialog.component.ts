import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
// import { UiModalComponent } from '../ui-modal/ui-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { actionsDomain, layersDomain, onActionsDomain } from './const/LocalStorageConstants';
import { CachedSrcDirective } from './CachedSrcDirective.directive';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
// import { LocalStorageConstants } from '../../constants/localStorageConstants';

@Component({
  selector: 'app-geolocation-dialog',
  standalone: true,
  imports:[DirectivesModule],
  templateUrl: './geolocation-dialog.component.html',
  styleUrls: ['./geolocation-dialog.component.scss'],
})
export class GeolocationDialogComponent
  implements OnInit {
  @Input() actions: {
    id: string;
    title: string;
    icon: string;
  }[] = [{
    id: 'add',
    title: 'Add Polygon',
    icon: 'add_circle_outline',
  }];
  @Input() layers: {
    title: string;
    url: string;
  }[] = [
      {
        title: "heeeeer",
        url: "https://tiles.arcgis.com/tiles/yLODIUIxVXuW5qAs/arcgis/rest/services/%D9%85%D8%A8%D9%86%D9%89_%D8%AF%D9%88%D8%B1%D8%A7%D8%AA_%D9%85%D9%8A%D8%A7%D9%87_%D8%A7%D9%84%D8%AA%D8%B4%D8%BA%D9%8A%D9%84_%D9%88%D8%A7%D9%84%D8%B5%D9%8A%D8%A7%D9%86%D8%A9/SceneServer?f=json",
      },
    ];

  @Output()
  on3dObjectClick = new EventEmitter<object>();
  url: string;
  constructor(private domSanitizer: DomSanitizer) {
    // super();
  }

  ngOnInit(): void {
    localStorage.setItem(actionsDomain, JSON.stringify(this.actions));
    localStorage.setItem(layersDomain, JSON.stringify(this.layers));
    this.setSanitizedUrl();
    // this.cleanup();
  }
  @HostListener('window:storage', ['$event'])
  onStorageChange(event: any): void {
    if (event.key === onActionsDomain) {
      const data = JSON.parse(event.newValue || '{');
      this.on3dObjectClick.emit(event.newValue);
    }
  }
  public setSanitizedUrl(): any {
    this.url = `./assets/pages/kemorave.html?s=` + new Date().getTime();
    // this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url).toString();
  }
  public cleanup(): void {
    localStorage.removeItem(actionsDomain);
    localStorage.removeItem(onActionsDomain);
    localStorage.removeItem(layersDomain);
  }

}
