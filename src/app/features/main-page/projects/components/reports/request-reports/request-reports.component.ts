import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { ReportsService } from '../reports.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { IncomingRequestsService } from '../../visit-requests/components/incoming-requests/services/incoming-requests.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request-reports',
  templateUrl: './request-reports.component.html',
  styleUrls: ['./request-reports.component.scss']
})
export class RequestReportsComponent {
  showBreadcrumb: boolean = true;
  showFilterPopup: boolean = false;
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  values: any[] = [];
  totalPageCount!: number;

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  typeLookup: any = [];
  projectClassificationList: any = [];
  searchValue!: string;
  filterDataParams = new FilterDataParams();
  pdfSrc: SafeResourceUrl | undefined;
  selectedNodes;

  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private reports: ReportsService, private sanitizer: DomSanitizer, private _incomingRequestsService: IncomingRequestsService, private route: ActivatedRoute, private router: Router

  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.filterForm.patchValue(params);
        if (!this.selectedNodes) {
          this.selectedNodes = {};
        }
        this.selectedNodes.id = this.filterForm.value.visitRequestTypeName;
        this.popupFilter();
      }
    });
    // GET ALL
    this.getAllRequestReports();
    this.getLookUps()
    // LOOKUPS
    this.getProjectClassifications()

  }
  // --------------------------------------------
  // GET ALL RequestReports
  // --------------------------------------------
  getAllRequestReports(paganations?: any) {
    this.filterDataParams.fullResult = true

    this.reports.getReportRequestPDF(paganations, this.filterDataParams).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    }, error => {
      console.error('Error fetching PDF:', error);
    });
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
    this._sharedService.getProjectClassifications()
      .subscribe((projectClassification) => {
        this.projectClassificationList = projectClassification.data;
      });
  }

  //=================================================
  // FILTERS BY TEXT
  //=================================================
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllRequestReports();
  }
  //=================================================
  // FILTERS POPUP
  //=================================================
  onShowFilterPopup() {
    this.showFilterPopup = true;
    this.selectedNodes = null;

  }
  filterForm = this._fb.group({
    visitRequestTypeName: [],
    visitRequestStatusId: [],
    StartDate: [],

  });
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.filterForm.value.visitRequestTypeName) {
      this.filterDataParams.filterItems.push({
        key: 'RequestTypeId',
        operator: 'equals',
        value: String(this.selectedNodes.id),
      });
    }

    if (this.filterForm.value.visitRequestStatusId)
      this.filterDataParams.filterItems.push({
        key: 'visitRequestStatusId',
        operator: 'equals',
        value: this.filterForm.value.visitRequestStatusId,
      });

    if (this.filterForm.value.StartDate)
      this.filterDataParams.filterItems.push({
        key: 'StartDate',
        operator: 'equals',
        value: this.filterForm.value.StartDate,
      });


    this.getAllRequestReports();
    this.showFilterPopup = false;
  }
  closePopupFilter() {
    this.filterForm.reset();
    this.showFilterPopup = false;
    this.popupFilter();
  }
  // exportReport(paganations?:any){
  //   this.filterDataParams.fullResult =true

  //   this.reports.getReportRequestPDF(paganations, this.filterDataParams).subscribe({
  //     next: (response: Blob) => {
  //       const fileURL = URL.createObjectURL(response);
  //       const a = document.createElement('a');
  //       a.href = fileURL;
  //       a.download = 'report.pdf';
  //       a.click();
  //       URL.revokeObjectURL(fileURL);
  //     },
  //     error: (err) => {
  //       console.error('Error downloading the PDF', err);
  //     },
  //   });
  // }

  exportReport(type: 'pdf' | 'excel' | 'word', paganations?: any) {
    this.filterDataParams.fullResult = true;
    if (type === 'pdf') {
      this.filterDataParams.renderType = 1
    }
    if (type === 'excel') {
      this.filterDataParams.renderType = 2
    }
    if (type === 'word') {
      this.filterDataParams.renderType = 3
    }
    this.reports.getReportRequestPDF(paganations, this.filterDataParams).subscribe({
      next: (response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = fileURL;

        // Set the correct filename and extension
        let extension = '';
        if (type === 'pdf') extension = 'pdf';
        else if (type === 'excel') extension = 'xls'; // or 'xls'
        else if (type === 'word') extension = 'doc';

        a.download = `report.${extension}`;
        a.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (err) => {
        console.error(`Error downloading the ${type.toUpperCase()} file`, err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.pdfSrc) {
      URL.revokeObjectURL(this.pdfSrc.toString());
    }
  }
  BackButton() {
    this.router.navigate(['projects/reports/fillterRequest'])
  }
}

