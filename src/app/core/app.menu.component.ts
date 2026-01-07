import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';

import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  @Input() model = [];

  constructor(private route: Router) {
  }

  ngOnInit() {
    // this.model = [
    //     { label: 'لوحة التحكم', icon: '../../assets/icons/dashboard.svg', iconActive: '../../assets/icons/dashboardActive.svg', routerLink: ['/dashboard'] },
    //     { label: 'المباني', icon: '../../assets/icons/mainBuilding.svg', iconActive: '../../assets/icons/mainBuildingActive.svg', routerLink: ['/main-building'] },
    //     { label: 'المباني الفرعية', icon: '../../assets/icons/subUnits.svg', iconActive: '../../assets/icons/subUnitsActive.svg', routerLink: ['/sub-unit'] },
    //     { label: 'طلبات الصيانة', icon: '../../assets/icons/maintenanceRequests.svg', iconActive: '../../assets/icons/maintenanceRequestsActive.svg', routerLink: ['/maintenance-request'] },
    //     { label: 'أنواع الأعطال', icon: '../../assets/icons/malfunctionsTypes.svg', iconActive: '../../assets/icons/malfunctionsTypesActive.svg', routerLink: ['/malfunctions-types'] },
    //     { label: 'الإعدادات', icon: '../../assets/icons/settings.svg', iconActive: '../../assets/icons/settingsActive.svg', routerLink: ['/setting'] }
    // ];
  }
}
