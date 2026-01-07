import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { ReportsService } from '../reports.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects-reports',
  templateUrl: './projects-reports.component.html',
  styleUrls: ['./projects-reports.component.scss'],
})
export class ProjectsReportsComponent {
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
  projectStatusList: any = [];
  projectClassificationList: any = [];
  officeList: any = [];
  searchValue!: string;
  filterDataParams = new FilterDataParams();
  pdfSrc: SafeResourceUrl | undefined;

  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private reports: ReportsService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
//         if(params['deliveryDate'][1]){
 
//           params['deliveryDate'] = [new Date(params['deliveryDate'][0])];

//         }
        this.filterForm.patchValue(params);
        this.popupFilter();
      }
    });
    // GET ALL
    this.getAllProjectReports();
    // LOOKUPS
    this.getAllTyps();
    this.getStatus();
    this.getOffice();
    this.getProjectClassifications();
  }
  // --------------------------------------------
  // GET ALL progict Request
  // --------------------------------------------
  getAllProjectReports(paganations?: any) {
    this.filterDataParams.fullResult = true
    this.reports.getReportPDF(paganations, this.filterDataParams).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      },
      (error) => {
        console.error('Error fetching PDF:', error);
      }
    );
  }

  getAllTyps() {
    this._sharedService.getProjectType().subscribe((res) => {
      this.typeLookup = res.data;
    });
  }
  getStatus() {
    this._sharedService.getProjectStatus().subscribe((projectStatusReq) => {
      this.projectStatusList = projectStatusReq.data;
    });
  }
  getOffice() {
    this._sharedService.getOfficeList().subscribe((office) => {
      this.officeList = office.data;
    });
  }

  getProjectClassifications() {
    this._sharedService
      .getProjectClassifications()
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
    this.getAllProjectReports();
  }
  //=================================================
  // FILTERS POPUP
  //=================================================
  onShowFilterPopup() {
    this.showFilterPopup = true;
  }
  filterForm = this._fb.group({
    ProjectTypeId: [],
    ProjectStatueId: [],
    ProjectClassificationId: [],
    OfficeId: [],
    startDate: [],
    deliveryDate: [],
  });
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.filterForm.value.ProjectTypeId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectTypeId',
        operator: 'equals',
        value: this.filterForm.value.ProjectTypeId,
      });
    if (this.filterForm.value.ProjectStatueId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectStatueId',
        operator: 'equals',
        value: this.filterForm.value.ProjectStatueId,
      });
    if (this.filterForm.value.ProjectClassificationId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectClassificationId',
        operator: 'equals',
        value: this.filterForm.value.ProjectClassificationId,
      });
    if (this.filterForm.value.OfficeId)
      this.filterDataParams.filterItems.push({
        key: 'OfficeId',
        operator: 'equals',
        value: this.filterForm.value.OfficeId,
      });


if (this.filterForm.value.startDate) {
  const [start, end] = this.filterForm.value.startDate;

  if (start && (!end || end === "null")) {
    const s = new Date(start);
    s.setHours(s.getHours() + 1);

    this.filterDataParams.filterItems.push({
      key: 'startDate',
      operator: 'equals',
      value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
    });
  }

  if (start && end && end !== "null") {
    const s = new Date(start);
    s.setHours(s.getHours() + 1);
    this.filterDataParams.filterItems.push({
      key: 'startDate',
      operator: 'GreaterThanOrEquals',
      value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
    });

    const e = new Date(end);
    e.setHours(e.getHours() + 1);
    this.filterDataParams.filterItems.push({
      key: 'startDate-R2-',
      operator: 'LessThanOrEquals',
      value: `${e.getMonth() + 1}-${e.getDate()}-${e.getFullYear()}`,
    });
  }
}

if (this.filterForm.value.deliveryDate) {
  const [start, end] = this.filterForm.value.deliveryDate;

  if (start && (!end || end === "null")) {
    const s = new Date(start);
    s.setHours(s.getHours() + 1);

    this.filterDataParams.filterItems.push({
      key: 'deliveryDate',
      operator: 'equals',
      value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
    });
  }

  if (start && end && end !== "null") {
    const s = new Date(start);
    s.setHours(s.getHours() + 1);
    this.filterDataParams.filterItems.push({
      key: 'deliveryDate',
      operator: 'GreaterThanOrEquals',
      value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
    });
    const e = new Date(end);
    e.setHours(e.getHours() + 1);
    this.filterDataParams.filterItems.push({
      key: 'deliveryDate-R2-',
      operator: 'LessThanOrEquals',
      value: `${e.getMonth() + 1}-${e.getDate()}-${e.getFullYear()}`,
    });
  }
}



    this.getAllProjectReports();
    this.showFilterPopup = false;
  }
  closePopupFilter() {
    this.filterForm.reset();
    this.showFilterPopup = false;
    this.popupFilter();
  }
  // exportReport(paganations?:any) {
  //   this.filterDataParams.fullResult =true

  //   this.reports.getReportPDF(paganations, this.filterDataParams).subscribe({
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
    this.reports.getReportPDF(paganations, this.filterDataParams).subscribe({
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
    this.router.navigate(['projects/reports/fillterReports'])
  }
}
