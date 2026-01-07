import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { MaintenanceReportService } from './maintenance-report.service';

@Component({
  selector: 'app-maintenance-report',
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss'],
})
export class MaintenanceReportComponent {
  showBreadcrumb: boolean = true;
  showFilterPopup: boolean = false;
  isSearchingReasult: boolean = false;
  values: any[] = [];
  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  builldingLookup: any = [];
  buildingSubUnitLookup: any = [];
  visitRequestsStatusLookup: any = [];
  requestPrioretyLookup: any = [];
  primaryMaintenanceTypeLookup: any = [];
  secondaryMaintenanceTypeLookup: any = [];
  searchValue!: string;
  filterDataParams = new FilterDataParams();
  pdfSrc: SafeResourceUrl | undefined;
  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private reports: MaintenanceReportService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      if (params) {
        this.filterForm.patchValue(params);
        this.popupFilter();
      }
    });

    // GET ALL
    this.getAllMaintenanceReports();
    // LOOKUPS
    this.getAllBuildingLookup();
    this.getVisitRequestsStatus();
    this.getRequestPriorety();
    this.getAllPrimaryMaintenanceType();
  }
  // --------------------------------------------
  // GET ALL Maintenance Request
  // --------------------------------------------
  getAllMaintenanceReports(paganations?: any) {
    this.filterDataParams.fullResult = true;

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
  getAllBuildingLookup() {
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.builldingLookup = res.data;
    });
  }
  getAllBuildingSubUnit(id: number) {
    this._sharedService.getAllBuildingSubUnit(id).subscribe((res) => {
      this.buildingSubUnitLookup = res.data;
    });
  }
  getVisitRequestsStatus() {
    this._sharedService.getVisitRequestsStatus().subscribe((res) => {
      this.visitRequestsStatusLookup = res['data'];
    });
  }
  getRequestPriorety() {
    this.requestPrioretyLookup = this._sharedService.getRequestPriorety();
  }
  getAllPrimaryMaintenanceType() {
    this._sharedService.getAllPrimaryMaintenanceType().subscribe((res) => {
      this.primaryMaintenanceTypeLookup = res.data;
    });
  }
  getMaintTypesByParent(id: number) {
    this._sharedService.getMaintTypesByParent(id).subscribe((res) => {
      this.secondaryMaintenanceTypeLookup = res.data;
    });
  }

  //=================================================
  // FILTERS BY TEXT
  //=================================================
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllMaintenanceReports();
  }
  //=================================================
  // FILTERS POPUP
  //=================================================
  onShowFilterPopup() {
    this.showFilterPopup = true;
  }
  filterForm = this._fb.group({
    buildingId: [],
    subUnitId: [],
    mainCategoryType: [],
    subCategoryType: [],
    maintenanceRequestStatusId: [],
    requestPriorety: [],
  });
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.filterForm.value.buildingId)
      this.filterDataParams.filterItems.push({
        key: 'buildingId',
        operator: 'equals',
        value: this.filterForm.value.buildingId,
      });
    if (this.filterForm.value.subUnitId)
      this.filterDataParams.filterItems.push({
        key: 'subUnitId',
        operator: 'equals',
        value: this.filterForm.value.subUnitId,
      });
    if (this.filterForm.value.subCategoryType)
      this.filterDataParams.filterItems.push({
        key: 'SubCategoryType',
        operator: 'equals',
        value: this.filterForm.value.subCategoryType,
      });
    if (this.filterForm.value.maintenanceRequestStatusId)
      this.filterDataParams.filterItems.push({
        key: 'MaintenanceRequestStatusId',
        operator: 'equals',
        value: this.filterForm.value.maintenanceRequestStatusId,
      });
    if (this.filterForm.value.requestPriorety)
      this.filterDataParams.filterItems.push({
        key: 'RequestPriorety',
        operator: 'equals',
        value: this.filterForm.value.requestPriorety,
      });

    this.getAllMaintenanceReports();
    this.showFilterPopup = false;
  }
  closePopupFilter() {
    this.filterForm.reset();
    this.showFilterPopup = false;
    this.popupFilter();
  }
  // exportReport(type:any , paganations?: any) {
  //   this.filterDataParams.fullResult = true;
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
    this.router.navigate(['/maintenance/fillter-maintenance']);
  }
}
