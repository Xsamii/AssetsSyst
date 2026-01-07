import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MonthlyReportService } from '../monthly-report.service';

@Component({
  selector: 'app-main-tab',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.scss'],
})
export class MainTabComponent implements OnInit {
  constructor(
    private router: Router,
    private MonthlyReportService: MonthlyReportService
  ) {}
  tabList!: any[];
  List!: any[];
  mainList!: any[];
  selectedTabId!: number;
  mainTabName!: string;
  showBreadcrumb: boolean = true;
  showFilterPopup: boolean = false;
  isSearchingReasult: boolean = false;
  ngOnInit(): void {
    this.getAllTab();
  }
  openFolder(main: any) {
    this.router.navigate([
      'monthly-report/sub-tab',
      main.id,
      this.mainTabName,
      main.name,
    ]);
  }

  getAllTab() {
    this.MonthlyReportService.GetMainTabweebLookUp().subscribe({
      next: (res: any) => {
        this.tabList = res.data ?? [];

        if (this.tabList.length > 0) {
          this.selectedTabId = this.tabList[0].id;
          this.mainTabName = this.tabList[0].name;

          this.List = this.tabList.map((item) => ({
            ...item,
            name:
              item.name.length > 25
                ? item.name.slice(0, 25) + '...'
                : item.name,
          }));
                  this.getMainTab(this.selectedTabId);

        }

      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getMainTab(id: number) {
    this.MonthlyReportService.GetMainTabweebData(id).subscribe({
      next: (res: any) => {
        this.mainList = res.data ?? [];
      },
      error: (err) => {
        console.error('Error loading main tab data', err);
      },
    });
  }

  changeselectedTab(data: any) {
    this.getMainTab(data);
    this.mainTabName = this.tabList.find((d) => d.id === data)?.name;
  }
}
