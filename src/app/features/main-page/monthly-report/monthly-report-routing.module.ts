import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingMonthlyReportComponent } from './setting-monthly-report/setting-monthly-report.component';
import { MainTabComponent } from './main-tab/main-tab.component';
import { SubTabComponent } from './sub-tab/sub-tab.component';


const routes: Routes = [
  {
    path: '',
    component: SettingMonthlyReportComponent,
  },
  {
    path: 'main-tab',
    component: MainTabComponent,
  },
  {
    path: 'sub-tab/:id/:name/:subname',
    component: SubTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyReportRoutingModule {}
