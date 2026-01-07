import { Component } from '@angular/core';
import { ReportsService } from '../reports.service';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { FormBuilder } from '@angular/forms';
import { IncomingRequestsService } from '../../visit-requests/components/incoming-requests/services/incoming-requests.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fillter-request',
  templateUrl: './fillter-request.component.html',
  styleUrls: ['./fillter-request.component.scss'],
})
export class FillterRequestComponent {
  showBreadcrumb: boolean = true;
  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  typeLookup: any = [];
  projectClassificationList: any = [];
  selectedNodes:any = null;
  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private reports: ReportsService,
    private _incomingRequestsService: IncomingRequestsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getLookUps();
    // LOOKUPS
    this.getProjectClassifications();
  }
  visitRequestTypesList;
  visitRequestStatusList;
  getLookUps() {
    forkJoin({
      requestTypeReq: this._sharedService.getVisitRequestTypes(),
      visitStatusReq: this._incomingRequestsService.getAllVisitRequestStatus(),
    }).subscribe(({ requestTypeReq, visitStatusReq }) => {
      this.visitRequestTypesList = requestTypeReq.data;
      this.visitRequestStatusList = visitStatusReq['data'];
    });
  }

  getProjectClassifications() {
    this._sharedService
      .getProjectClassifications()
      .subscribe((projectClassification) => {
        this.projectClassificationList = projectClassification.data;
      });
  }
  filterForm = this._fb.group({
    visitRequestTypeName: [],
    visitRequestStatusId: [],
    StartDate: [],
  });

  Filter() {
    if(this.filterForm.value.visitRequestTypeName){
      this.filterForm.controls['visitRequestTypeName'].patchValue(String(this.selectedNodes.id))
    } 
    this.router.navigate(['RequestReports'], {
      queryParams:this.filterForm.value,
    });
  }
  closeFilter() {
    this.filterForm.reset();
  }
}
