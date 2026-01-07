import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { RouterModule } from '@angular/router';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-setting-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './setting-sidebar.component.html',
  styleUrls: ['./setting-sidebar.component.scss'],
})
export class SettingSidebarComponent implements OnInit {
  roles = UserTypesEnum;
  userRole = +localStorage.getItem('maintainanceRole');

  @Input() sidebarData: any[] = [];
  showSidebarMenu: boolean = true;
  constructor(private sharedService: SharedService) {}
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
