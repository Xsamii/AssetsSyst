import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsSidebarComponent } from 'src/app/Shared/components/sidebars/projects-sidebar/projects-sidebar.component';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { MainSidebarComponent } from "../../../Shared/components/sidebars/main-sidebar/main-sidebar.component";
import { NavbarComponent } from 'src/app/Shared/components/navbar/navbar.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectsSidebarComponent, MainSidebarComponent, NavbarComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  showSidebarMenu: boolean = true;
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.showSideMenu.subscribe((value) => {
      this.showSidebarMenu = value;
    });
  }
}
