import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { RouterModule } from '@angular/router';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-projects-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-sidebar.component.html',
  styleUrls: ['./projects-sidebar.component.scss'],
})
export class ProjectsSidebarComponent implements OnInit {
  roles = UserTypesEnum;
  userRole = +localStorage.getItem('maintainanceRole');

  @Input() sidebarData: any[] = [];
  showSidebarMenu: boolean = true;
  constructor(private sharedService: SharedService) {
    if(this.userRole === 5){
      this.requestsMenu = true
    }
  }
  closeSidebarMenu() {
    this.showSidebarMenu = !this.showSidebarMenu;
    this.sharedService.showSideMenuFun(this.showSidebarMenu);
  }

  projectsMenu: boolean = false;
  requestsMenu: boolean = false;
  maintenanceMenu: boolean = false;
  
  showSubMenu(value?: string) {
    if (value == 'projects') {
      if (this.projectsMenu) {
        this.projectsMenu = false;
      } else {
        this.projectsMenu = true;
        this.requestsMenu = false;
        this.maintenanceMenu = false;
      }
    } else if (value == 'requests') {
      if (this.requestsMenu) {
        this.requestsMenu = false;
      } else {
        this.requestsMenu = true;
        this.projectsMenu = false;
        this.maintenanceMenu = false
      }
    }
    else if (value == 'maintenance-requests') {
      if (this.maintenanceMenu) {
        this.maintenanceMenu = false;
      } else {
        this.maintenanceMenu = true;
        this.projectsMenu = false;
        this.requestsMenu = false
      }
    }
    else {
      this.projectsMenu = false;
      this.requestsMenu = false;
      this.maintenanceMenu = false;
    }
  }
  ngOnInit(): void {
    this.sharedService.showSideMenu.subscribe((value) => {
      this.showSidebarMenu = value;
    });
    this.onResize();
  }
  // ===========================
  // ===========================
  public innerWidth: any;
  @HostListener('window:resize')
  onResize() {
    this.innerWidth = window.innerWidth;
    if (window.innerWidth > 992) {
      this.showSidebarMenu = true;
      this.sharedService.showSideMenuFun(this.showSidebarMenu);
    } else {
      this.showSidebarMenu = false;
      this.sharedService.showSideMenuFun(this.showSidebarMenu);
    }
  }
}
