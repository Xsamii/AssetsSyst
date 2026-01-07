import { map } from 'rxjs';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-fillter-project',
  templateUrl: './fillter-project.component.html',
  styleUrls: ['./fillter-project.component.scss'],
})
export class FillterProjectComponent {
  showBreadcrumb: boolean = true;

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  typeLookup: any = [];
  projectStatusList: any = [];
  projectClassificationList: any = [];
  officeList: any = [];

  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private router: Router
  ) { }
  ngOnInit(): void {
    // LOOKUPS
    this.getAllTyps();
    this.getStatus();
    this.getOffice();
    this.getProjectClassifications();
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

  filterForm = this._fb.group({
    ProjectTypeId: [],
    ProjectStatueId: [],
    ProjectClassificationId: [],
    OfficeId: [],
    startDate: [],
    deliveryDate: [],
  });

  // Filter() {
  //   const formValue = this.filterForm.value;
  //   const filterItems: any = {};

  //   const parseDate = (d: Date): string =>
  //     `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;

  //   const addDateFilters = (key: string, range: Date[]) => {
  //     if (range && range.length > 0) {
  //       const [start, end] = range;


  //       if (start && end) {
  //         filterItems[key] = {
  //           Key: key,
  //           Operator: 'GreaterThanOrEquals',
  //           Value: parseDate(new Date(start))
  //         };
  //         filterItems[`${key}-R2-`] = {
  //           Key: key,
  //           Operator: 'LessThanOrEquals',
  //           Value: parseDate(new Date(end))
  //         };
  //       } else if (start && !end) {
  //         filterItems[key] = {
  //           Key: key,
  //           Operator: 'equals',
  //           Value: parseDate(new Date(start))
  //         };
  //       }
  //     }
  //   };

  //   // Apply date filters
  //   addDateFilters('startDate', formValue.startDate);
  //   addDateFilters('deliveryDate', formValue.deliveryDate);

  //   // Add dropdown filters
  //   ['ProjectTypeId', 'ProjectStatueId', 'ProjectClassificationId', 'OfficeId'].forEach((key) => {
  //     if (formValue[key]) {
  //       filterItems[key] = {
  //         Key: key,
  //         Operator: 'equals',
  //         Value: this.filterForm.value[key]
  //       };

  //     }
  //   });

  //   this.router.navigate(['ProjectsReports'], {
  //     queryParams: filterItems
  //   });
  // }



  Filter() {
    this.router.navigate(['ProjectsReports'], {
      queryParams: this.filterForm.value
    });  }

  filterDataParams = new FilterDataParams();

  // Filter() {
  //   this.filterDataParams.filterItems = [];
  //   if (this.filterForm.value.ProjectTypeId)
  //     this.filterDataParams.filterItems.push({
  //       key: 'ProjectTypeId',
  //       operator: 'equals',
  //       value: this.filterForm.value.ProjectTypeId,
  //     });
  //   if (this.filterForm.value.ProjectStatueId)
  //     this.filterDataParams.filterItems.push({
  //       key: 'ProjectStatueId',
  //       operator: 'equals',
  //       value: this.filterForm.value.ProjectStatueId,
  //     });
  //   if (this.filterForm.value.ProjectClassificationId)
  //     this.filterDataParams.filterItems.push({
  //       key: 'ProjectClassificationId',
  //       operator: 'equals',
  //       value: this.filterForm.value.ProjectClassificationId,
  //     });
  //   if (this.filterForm.value.OfficeId)
  //     this.filterDataParams.filterItems.push({
  //       key: 'OfficeId',
  //       operator: 'equals',
  //       value: this.filterForm.value.OfficeId,
  //     });


  //   if (this.filterForm.value.startDate) {
  //     const [start, end] = this.filterForm.value.startDate;

  //     if (start && !end) {
  //       const s = new Date(start);
  //       s.setHours(s.getHours() + 1);

  //       this.filterDataParams.filterItems.push({
  //         key: 'startDate',
  //         operator: 'equals',
  //         value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
  //       });
  //     }

  //     if (start && end) {
  //       const s = new Date(start);
  //       s.setHours(s.getHours() + 1);
  //       this.filterDataParams.filterItems.push({
  //         key: 'startDate',
  //         operator: 'GreaterThanOrEquals',
  //         value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
  //       });

  //       const e = new Date(end);
  //       e.setHours(e.getHours() + 1);
  //       this.filterDataParams.filterItems.push({
  //         key: 'startDate-R2-',
  //         operator: 'LessThanOrEquals',
  //         value: `${e.getMonth() + 1}-${e.getDate()}-${e.getFullYear()}`,
  //       });
  //     }
  //   }

  //   if (this.filterForm.value.deliveryDate) {
  //     const [start, end] = this.filterForm.value.deliveryDate;

  //     if (start && !end) {
  //       const s = new Date(start);
  //       s.setHours(s.getHours() + 1);

  //       this.filterDataParams.filterItems.push({
  //         key: 'deliveryDate',
  //         operator: 'equals',
  //         value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
  //       });
  //     }

  //     if (start && end) {
  //       const s = new Date(start);
  //       s.setHours(s.getHours() + 1);
  //       this.filterDataParams.filterItems.push({
  //         key: 'deliveryDate',
  //         operator: 'GreaterThanOrEquals',
  //         value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
  //       });

  //       const e = new Date(end);
  //       e.setHours(e.getHours() + 1);
  //       this.filterDataParams.filterItems.push({
  //         key: 'deliveryDate-R2-',
  //         operator: 'LessThanOrEquals',
  //         value: `${e.getMonth() + 1}-${e.getDate()}-${e.getFullYear()}`,
  //       });
  //     }
  //   } 
  //   this.router.navigate(['ProjectsReports'], {
  //     queryParams: this.filterForm.value,
  //   });


  // }


  closeFilter() {
    this.filterForm.reset();
  }
}
