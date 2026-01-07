import { Component, ElementRef, Input } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AppMenuComponent } from './app.menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenuComponent, RouterModule],
  templateUrl: './app.sidebar.component.html',
  styles: [
    `
      .activeLink {
        background: white;
        color: #0c588bcf;
        border-radius: 8px;
        padding: 10px;
        width: 220px;
        font-weight: 600;
      }
    `,
  ],
})
export class AppSidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
  @Input() model = [];
  ngOnInit(): void {}
}
