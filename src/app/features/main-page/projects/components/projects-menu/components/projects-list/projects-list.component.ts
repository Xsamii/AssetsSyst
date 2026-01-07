import { Component } from '@angular/core';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ProjectsService } from '../services/projects.service';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { forkJoin } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    BreadCrumbComponent,
    NoDataYetComponent,
    SweetAlertMessageComponent,
    ListComponent,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    CalendarModule
  ],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent {
  userRole = +localStorage.getItem('maintainanceRole');
  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  cols: any[] = [];
  values: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  filterDataParams = new FilterDataParams();
  searchValue!: string;
  projectId;
  displayDialog: boolean = false;
  searchForm: FormGroup;
  projectStatusID: any;
  totalCount: number;
  competitionTypes: any[] = [
    { id: 1, name: 'منافسة محدودة' },
    { id: 2, name: 'منافسة عامة' },
  ];
  financialConnectionList: any[] = [
    { value: true, name: ' مرتبط' },
    { value: false, name: 'غير مرتبط' },
  ];
  constructor(
    private _projectsService: ProjectsService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService
  ) { }
  sharedBreadcrumbProperties = {
    imageTitle: './assets/icons/projectsActive.svg',
    subTitles: [
      { name: 'الرئيسية', routerLink: '/' },
      { name: 'إدارة المشاريع', routerLink: '/projects' },
      { name: 'المشاريع ', routerLink: '/projects/projects-menu' },
    ],
    isFilte: true,
    inputPlaceholder: 'ابحث باسم المشروع...',
    buttonText: 'مشروع جديد',
    saveBtnText: 'إضافة',
    isShowFilter: this.showBreadcrumb ? false : true,
    isShowAddEdite: false,
    showAddButton: this.userRole == 1 || this.userRole == 2,
  };

  getBreadCrumbSubTitles() {
    if (this.userRole == 5) {
      this.sharedBreadcrumbProperties.subTitles = [
        { name: '', routerLink: '' },
      ];
    }
  }

  ngOnInit(): void {
    this.getData();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'name', header: 'الاسم ' }),
      new listColumns({ field: 'projectTypeName', header: 'النوع' }),
      new listColumns({
        field: 'projectClassificationName',
        header: 'التصنيف ',
      }),
      new listColumns({ field: 'projectStatueName', header: 'الحالة ' }),
      new listColumns({ field: 'value', header: 'القيمة ' }),
      new listColumns({
        field: 'extractsNumber',
        header: 'المستخلصات ',
        isCurrency: true,
      }),
      new listColumns({
        field: 'taskCompletionRate',
        header: 'نسبة الانجاز ',
        isPercentage: true,
      }),
      new listColumns({
        field: 'financialConnection',
        header: 'الارتباط المالي ',
        financialConnection: true
      }),
    ];
    this.getStatus();
    this.initializeSearchForm();
  }

  openAdd() {
    this._router.navigate(['projects/projects-menu/add']);
  }
  openEdit(id) {
    this._router.navigate(['projects/projects-menu/edit', id]);
  }
  filterBySearchTesxt(value) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }
  fillterByprojectStatusid(event: any) { 
    this.projectStatusID = event;
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.projectStatusID)
      this.filterDataParams.filterItems.push({
        key: 'ProjectStatueId',
        operator: 'equals',
        value: String(this.projectStatusID),
      });
    this.getData();
  }

  deleteProject(event) {
    this.projectId = event;
    this.alertConfirm = true;
  }
  getData(paganations?: any) {
    this._projectsService
      .getAllProjectsList(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          this.values = data.data.items;
          this.totalCount = data.data.totalCount;
          if (
            this.isSearchingReasult == true ||
            (this.isSearchingReasult == false && this.values.length != 0)
          ) {
            this.showBreadcrumb = true;
          } else {
            this.showBreadcrumb = false;
          }
          this.totalPageCount = data.data.totalCount;
        },
        (err) => {
          this.alertError = true;
        }
      );
  }
  OnSubmitData() {
    this.popupFilter();
  }
  showDialog() {
    this.displayDialog = true;
    this.getDropDowns();
    // this.getAllProjectManagersByOfficeId(this.searchForm.value.OfficeId);
  }
  // getAllProjectManagersByOfficeId(event) {
  //   this._sharedService
  //     .getProjectManagersByOfficeId(event)
  //     .subscribe((data) => {
  //       this.projectManagerList = data.data;
  //     });
  // }
  initializeSearchForm() {
    this.searchForm = this._formBuilder.group({
      ProjectTypeId: [],
      ProjectClassificationId: [],
      ProjectStatueId: [],
      OfficeId: [],
      ProjectManagerId: [],
      competitionType: [],
      SupervisorOfficeId: [],
      financialConnection: [],
      startDate: [],
      deliveryDate: []
    });
  }
  projectTypeList;
  projectOrginList;
  projectClassificationList;
  projectStatusList;
  officeList;
  // projectManagerList;
  SupervisorOfficeList;
  getStatus() {
    this._sharedService.getProjectStatus().subscribe((projectStatusReq) => {
      this.projectStatusList = projectStatusReq.data;
    });
  }
  getDropDowns() {
    forkJoin({
      projectTypeReq: this._sharedService.getProjectType(),
      projectClassificationReq: this._sharedService.getProjectClassifications(),
      // projectStatusReq: this._sharedService.getProjectStatus(),
      // OfficeReq: this._sharedService.getContractors(),
      OfficeReq: this._sharedService.getOfficesByType(2),
      // projectManagerReq: this._sharedService.getManagers(),
      SupervisorOfficeReq: this._sharedService.getOfficesByType(1)
    }).subscribe(
      ({
        projectTypeReq,
        projectClassificationReq,
        // projectStatusReq,
        OfficeReq,
        // projectManagerReq,
        SupervisorOfficeReq
      }) => {
        this.projectTypeList = projectTypeReq.data;
        this.projectClassificationList = projectClassificationReq.data;
        // this.projectStatusList = projectStatusReq.data;
        this.officeList = OfficeReq.data;
        // this.projectManagerList = projectManagerReq.data;
        this.SupervisorOfficeList = SupervisorOfficeReq.data

      }
    );
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];

    if (this.searchForm.value.ProjectTypeId)

      this.filterDataParams.filterItems.push({ key: 'ProjectTypeId', operator: 'equals', value: String(this.searchForm.value.ProjectTypeId) });

    if (this.searchForm.value.ProjectClassificationId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectClassificationId',
        operator: 'equals',
        value: String(this.searchForm.value.ProjectClassificationId),
      });

    if (this.searchForm.value.competitionType)
      this.filterDataParams.filterItems.push({
        key: 'competitionType',
        operator: 'equals',
        value: String(this.searchForm.value.competitionType),
      });
    if (this.searchForm.value.OfficeId)
      this.filterDataParams.filterItems.push({
        key: 'OfficeId',
        operator: 'equals',
        value: String(this.searchForm.value.OfficeId),
      });
    if (this.searchForm.value.buildingId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectManagerId',
        operator: 'equals',
        value: String(this.searchForm.value.ProjectManagerId),
      });
    if (this.searchForm.value.SupervisorOfficeId)
      this.filterDataParams.filterItems.push({
        key: 'SupervisorOfficeId',
        operator: 'equals',
        value: String(this.searchForm.value.SupervisorOfficeId),
      });
    if (this.searchForm.value.financialConnection)
      this.filterDataParams.filterItems.push({
        key: 'financialConnection',
        operator: 'equals',
        value: String(this.searchForm.value.financialConnection),
      });



if (this.searchForm.value.startDate) {
  const [start, end] = this.searchForm.value.startDate;

  if (start && !end) {
    const s = new Date(start);
    s.setHours(s.getHours() + 1);

    this.filterDataParams.filterItems.push({
      key: 'startDate',
      operator: 'equals',
      value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
    });
  }

  if (start && end) {
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

if (this.searchForm.value.deliveryDate) {
  const [start, end] = this.searchForm.value.deliveryDate;

  if (start && !end) {
    const s = new Date(start);
    s.setHours(s.getHours() + 1);

    this.filterDataParams.filterItems.push({
      key: 'deliveryDate',
      operator: 'equals',
      value: `${s.getMonth() + 1}-${s.getDate()}-${s.getFullYear()}`,
    });
  }

  if (start && end) {
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



    this.getData();
    this.displayDialog = false;
  }
  hideDialog() {
    // this.searchForm.reset();
    this.displayDialog = false;
    // this.popupFilter();
    this.filterDataParams.filterItems = [];
    // this.financialConnectionList =[]
    this.initializeSearchForm();
    this.getData();
  }

  // ------------------------------------
  // SWEET ALERTS
  // ------------------------------------
  // SUCCESS
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }
  // WARNING
  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
    } else {
      // this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }
  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._projectsService.deleteProject(this.projectId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم حذف المشروع بنجاح من قائمة المشاريع، يمكنك المتابعة';
          this.getData();
        } else {
          this.alertConfirm = false;
          this.alertError = true;
          this.alertFailureMessage = res.errors[0].message;
        }
      });
    } else {
      this.alertConfirm = false;
    }
  }
  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
}
