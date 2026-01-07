import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingSidebarComponent } from 'src/app/Shared/components/sidebars/setting-sidebar/setting-sidebar.component';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { MainSidebarComponent } from "../../../Shared/components/sidebars/main-sidebar/main-sidebar.component";
import { NavbarComponent } from 'src/app/Shared/components/navbar/navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingSidebarComponent, MainSidebarComponent, NavbarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  showSidebarMenu: boolean = true;
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.showSideMenu.subscribe((value) => {
      this.showSidebarMenu = value;
    });
  }
}
