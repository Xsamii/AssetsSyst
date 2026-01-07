import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from 'src/app/Shared/components/navbar/navbar.component';
import { MainSidebarComponent } from 'src/app/Shared/components/sidebars/main-sidebar/main-sidebar.component';
import { SharedService } from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent {

  constructor(private sharedService: SharedService) { }
  // sidebarMenu = [
  //   {
  //     label: 'لوحة التحكم',
  //     icon: 'assets/icons/dashboard.svg',
  //     iconActive: 'assets/icons/dashboardActive.svg',
  //     routerLink: ['/buildings'],
  //   },
  //   {
  //     label: 'المباني',
  //     icon: 'assets/icons/mainBuildings.svg',
  //     iconActive: 'assets/icons/mainBuildingsActive.svg',
  //     routerLink: ['main-buildings'],
  //   },
  //   {
  //     label: 'المباني الفرعية',
  //     icon: 'assets/icons/subUnits.svg',
  //     iconActive: 'assets/icons/subUnitsActive.svg',
  //     routerLink: ['sub-units'],
  //   },
  //   {
  //     label: 'طلبات الصيانة',
  //     icon: 'assets/icons/maintenanceRequests.svg',
  //     iconActive: 'assets/icons/maintenanceRequestsActive.svg',
  //     routerLink: ['maintenace-requests'],
  //   },
  //   {
  //     label: 'أنواع الأعطال',
  //     icon: 'assets/icons/malfunctionTypes.svg',
  //     iconActive: 'assets/icons/malfunctionTypesActive.svg',
  //     routerLink: ['malfunctions-types'],
  //   },
  //   {
  //     label: 'الإعدادات',
  //     icon: 'assets/icons/settings.svg',
  //     iconActive: 'assets/icons/settingsActive.svg',
  //     routerLink: ['buildings-settings'],
  //   },
  // ];

  ngOnInit(): void {

  }
}
