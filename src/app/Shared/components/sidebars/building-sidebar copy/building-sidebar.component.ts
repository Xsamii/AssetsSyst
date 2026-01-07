import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-building-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './building-sidebar.component.html',
  styleUrls: ['./building-sidebar.component.scss'],
})
export class BuildingSidebarComponent implements OnInit {
  roles = UserTypesEnum;
  userRole = +localStorage.getItem('maintainanceRole');
  @Input() sidebarData: any[] = [];
  maintenanceMenu = true;
  showSidebarMenu: boolean = true;
  constructor(private sharedService: SharedService, private _router: Router) {}
  closeSidebarMenu() {
    this.showSidebarMenu = !this.showSidebarMenu;
    this.sharedService.showSideMenuFun(this.showSidebarMenu);
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
