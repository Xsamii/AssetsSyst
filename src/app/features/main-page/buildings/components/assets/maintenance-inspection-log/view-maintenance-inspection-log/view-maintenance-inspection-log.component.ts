import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { MaintenanceInspectionLogService } from '../maintenance-inspection-log.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-maintenance-inspection-log',
  templateUrl: './view-maintenance-inspection-log.component.html',
  styleUrls: ['./view-maintenance-inspection-log.component.scss'],
  standalone: true,
  imports: [BreadcrumbModule, BreadCrumbComponent,CommonModule],
})
export class ViewMaintenanceInspectionLogComponent implements OnInit{
  values:any
  constructor(private _router: Router, private _route: ActivatedRoute,
     private _MaintenanceInspectionLog: MaintenanceInspectionLogService
  ) {}
  ngOnInit(): void {
      let id = Number(this._route.snapshot.paramMap.get('id'));
    this.getDataById(id)
  }
  print() {}
  onCancle() {
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
    this._router.navigateByUrl(returnUrl);
  }

  getDataById(id) {
    this._MaintenanceInspectionLog.getMaintenanceInspectionLogById(id).subscribe((res) => {
      this.values = res.data;
    
    });
  }
}
