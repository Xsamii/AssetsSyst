import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

interface MenuState {
  map: boolean;
  buildings: boolean;
  maintenance: boolean;
  maintenancePlanSettings: boolean;
  projects: boolean;
  inventory: boolean;
  settings: boolean;
  reports: boolean;
  arch: boolean;
  evaluation: boolean;
}

interface SubMenuState {
  projects: boolean;
  requests: boolean;
  reports: boolean;
  arch: boolean;
}

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
})
export class MainSidebarComponent implements OnInit {
  roles = UserTypesEnum;
  userRole = +localStorage.getItem('maintainanceRole');

  @Input() sidebarData: any[] = [];

  showSidebarMenu: boolean = true;

  // Main menu states
  menuState: MenuState = {
    map: false,
    buildings: false,
    maintenance: false,
    maintenancePlanSettings: false,
    projects: false,
    inventory: false,
    settings: false,
    reports: false,
    arch: false,
    evaluation: false,
  };

  // Sub menu states
  subMenuState: SubMenuState = {
    projects: false,
    requests: false,
    reports: false,
    arch: false,
  };

  public innerWidth: number = window.innerWidth;

  constructor(private sharedService: SharedService, private router: Router) {}

  ngOnInit(): void {
    this.initializeMenuSubscriptions();
    this.handleResponsiveLayout();
    this.setActiveMenuFromRoute();
  }

  // Initialize shared service subscriptions
  private initializeMenuSubscriptions(): void {
    this.sharedService.showSideMenu.subscribe((value) => {
      this.showSidebarMenu = value;
    });

    this.sharedService.homeIsClicked.subscribe((value) => {
      if (value) {
        this.toggleMainMenu('buildings');
        this.sharedService.HomeClickedFun(false);
      }
    });
  }

  // Set active menu based on current route
  private setActiveMenuFromRoute(): void {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/buildings')) {
      this.toggleMainMenu('buildings');
    } else if (currentUrl.includes('/projects')) {
      this.toggleMainMenu('projects');
    } else if (currentUrl.includes('/settings')) {
      this.toggleMainMenu('settings');
    } else if (currentUrl.includes('/inventory')) {
      this.toggleMainMenu('inventory');
    } else if (currentUrl.includes('/map')) {
      this.toggleMainMenu('map');
    } else if (currentUrl.includes('/maintenance-plan-settings')) {
      this.toggleMainMenu('maintenancePlanSettings');
    } else if (currentUrl.includes('/maintenance')) {
      this.toggleMainMenu('maintenance');
    } else if (currentUrl.includes('/monthly-report')) {
      this.toggleMainMenu('arch');
    } else if (
      currentUrl.includes('/reports') ||
      currentUrl.includes('/fillter-maintenance') ||
      currentUrl.includes('/fillterReports') ||
      currentUrl.includes('/fillterRequest')
    ) {
      this.toggleMainMenu('reports');
    }
  }

  // Toggle main menu sections
  toggleMainMenu(section: keyof MenuState, forceOpen: boolean = false): void {
    // Close all other menus
    Object.keys(this.menuState).forEach((key) => {
      if (key !== section) {
        this.menuState[key as keyof MenuState] = false;
      }
    });

    // Toggle or force open the selected menu
    if (forceOpen) {
      this.menuState[section] = true;
    } else {
      this.menuState[section] = !this.menuState[section];
    }

    // Clear sub-menus when switching main menus
    this.clearSubMenus();
  }

  // Toggle sub-menu sections
  toggleSubMenu(subSection: keyof SubMenuState): void {
    // Close other sub-menus
    Object.keys(this.subMenuState).forEach((key) => {
      if (key !== subSection) {
        this.subMenuState[key as keyof SubMenuState] = false;
      }
    });

    // Toggle the selected sub-menu
    this.subMenuState[subSection] = !this.subMenuState[subSection];
  }

  // Clear all sub-menus
  private clearSubMenus(): void {
    Object.keys(this.subMenuState).forEach((key) => {
      this.subMenuState[key as keyof SubMenuState] = false;
    });
  }

  // Close sidebar (for mobile)
  closeSidebarMenu(): void {
    this.showSidebarMenu = !this.showSidebarMenu;
    this.sharedService.showSideMenuFun(this.showSidebarMenu);
  }

  // Handle responsive layout changes
  @HostListener('window:resize')
  private handleResponsiveLayout(): void {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth > 992) {
      this.showSidebarMenu = true;
    } else {
      this.showSidebarMenu = false;
    }

    this.sharedService.showSideMenuFun(this.showSidebarMenu);
  }

  // Convenience methods for template (backward compatibility)
  showMapSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('map', !toggle);
  }
  showEvaluationSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('evaluation', !toggle);
  }

  showbuildingSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('buildings', !toggle);
  }

  showMaintenanceSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('maintenance', !toggle);
  }

  showMaintenancePlanSettingsSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('maintenancePlanSettings', !toggle);
  }

  showProjectsSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('projects', !toggle);
  }

  showSettingSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('settings', !toggle);
  }

  showInventorySubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('inventory', !toggle);
  }

  showReportsSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('reports', !toggle);
  }
  showArchSubMenu(toggle: boolean = false): void {
    this.toggleMainMenu('arch', !toggle);
  }
  showSubMenu(value?: string): void {
    if (!value) {
      this.clearSubMenus();
      return;
    }

    if (value === 'projects') {
      this.toggleSubMenu('projects');
    } else if (value === 'requests') {
      this.toggleSubMenu('requests');
    } else if (value === 'reports') {
      this.toggleSubMenu('reports');
    }
  }

  // Getters for template (backward compatibility)
  get mapSubMenu(): boolean {
    return this.menuState.map;
  }

  get EvaluationSubMenu(): boolean {
    return this.menuState.evaluation;
  }

  get buildingsOpenMenu(): boolean {
    return this.menuState.buildings;
  }

  get maintenanceOpenMenu(): boolean {
    return this.menuState.maintenance;
  }

  get maintenancePlanSettingsOpenMenu(): boolean {
    return this.menuState.maintenancePlanSettings;
  }

  get projectsOpenMenu(): boolean {
    return this.menuState.projects;
  }

  get settingOpenMenu(): boolean {
    return this.menuState.settings;
  }

  get inventoryOpenMenu(): boolean {
    return this.menuState.inventory;
  }

  get reportsOpenMenu(): boolean {
    return this.menuState.reports;
  }
  get archOpenMenu(): boolean {
    return this.menuState.arch;
  }

  get projectsMenu(): boolean {
    return this.subMenuState.projects;
  }

  get requestsMenu(): boolean {
    return this.subMenuState.requests;
  }

  get reportsMenu(): boolean {
    return this.subMenuState.reports;
  }
}
