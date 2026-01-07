import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { TreeTableModule } from 'primeng/treetable';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { RequestTypeService } from './services/request-types.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { MenuItem, TreeNode } from 'primeng/api';
import { TreeSelectModule } from 'primeng/treeselect';
import { ButtonModule } from 'primeng/button';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';

@Component({
  selector: 'app-requests-types',
  standalone: true,
  imports: [
    BreadCrumbComponent,
    DropdownModule,
    CommonModule,
    SweetAlertMessageComponent,
    TreeTableModule,
    MenuModule,
    PaginatorModule,
    ReactiveFormsModule,
    TreeSelectModule,
    FormsModule,
    ButtonModule,
    NoDataYetComponent,
  ],
  templateUrl: './requests-types.component.html',
  styleUrls: ['./requests-types.component.scss'],
})
export class RequestsTypesComponent {
  // ------------------------------------
  // VALUES
  // ------------------------------------
  tree: TreeNode[];
  menuItems: MenuItem[];
  filteredDate = new FilterDataParams();
  totalItemsCount: any;
  itemsPerPage: any = this.filteredDate.maxResultCount;
  currentPage: any = 1;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 50, value: 50 },
  ];
  first: number = 0;
  rows: number = 10;

  values: any[] = [];
  cols: any[] = [];
  totalPageCount!: number;
  searchValue!: string;
  isSearchingReasult: boolean = false;
  showBreadcrumb: boolean = true;
  requestTypeId: number;
  alertConfirm: boolean = false;
  alertSuccess: boolean = false;
  alertSuccessMsg: string;
  alertError: boolean = false;
  alertErrorMsg: string;
  alertWarning: boolean = false;
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  taskId: number;
  requestTypeList: any;
  projectTasksList;
  selectedNodes;

  filterDataParams = new FilterDataParams();
  requestTypeForm = this._fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    ],
    parentId: [''],
  });
  get formControls() {
    return this.requestTypeForm.controls;
  }

  // ------------------------------------
  // CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _requestTypeService: RequestTypeService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) {}
  selectedId: number;

  initializeMenu(event) {
    this.selectedId = event.id;
    this.menuItems = [
      {
        label: 'تعديل',
        visible: true,
        icon: 'fa-regular fa-pen-to-square',
        command: () => this.openEdit(event.id),
      },
      {
        label: 'حذف',
        visible: true,
        icon: 'fa-solid fa-trash-can',
        command: () => this.alertConfirmFun(event.id),
      },
    ];
  }
  onDelete() {
    this.alertError = true;
  }
  onPageChange(event) {
    this.filteredDate.maxResultCount = event.rows;
    this.filteredDate.skipCount = event.first;
    this.getData(event);
  }

  // ------------------------------------
  // ADD EDIT
  // ------------------------------------
  openAdd() {
    this.isEditMode = false;
    this.requestTypeForm.reset();
    this.showAddEditPopup = true;
    this.requestTypeId = null;
    this.selectedNodes = null;
    this.getLookUps();
  }

  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.requestTypeId = id;
    this.getLookUps();

    this._requestTypeService.getVisitReuestTypeById(id).subscribe((res) => {
      // this.getLookUps();
      this.selectedNodes = res['data'].data.parentId;
      this.selectedNodes = {
        id: res['data'].data.parentId,
        label: res['data'].data.pranetName,
      };

      this.requestTypeForm.patchValue({
        name: res['data'].data.name,
        // parentId: res.data.parentId,
      });
    });
    
    
  }
  OnSubmitData() {
    const obj = {
      id: this.requestTypeId,
      name: this.requestTypeForm.value.name,
      parentId: this.selectedNodes?.id,
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._requestTypeService.createVisitRequestType(obj).subscribe((res) => {
        this.requestTypeForm.reset();
        this.getData();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة نوع تاطلب بنجاح إلى قائمة أنواع الطلبات، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._requestTypeService.updateVisitRequestType(obj).subscribe((res) => {
        this.requestTypeForm.reset();
        this.getData();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تم تعديل تفاصيل نوع الطلب بنجاح، يمكنك المتابعة';
      });
    }
  }
  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  getLookUps() {
    this._sharedService.getVisitRequestTypes().subscribe((res) => {
      this.requestTypeList = res.data;
      if(this.isEditMode == true){
        this.requestTypeList = this.requestTypeList.filter(x => x.id !== this.requestTypeId);
      }
      // this.selectedNodes = 61;
    });
  }

  // ------------------------------------
  // SWEET ALERT FUNCTIONS
  // ------------------------------------
  alertSuccessFun(value: boolean) {
    if (value) {
      this.alertSuccess = false;
    }
  }
  alertErrorFun(value: boolean) {
    if (value) {
      this.alertError = false;
    }
  }
  alertConfirmFun(value: boolean) {
    if (value) {
      this._requestTypeService
        .deleteVisitRequestType(this.selectedId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.alertConfirm = false;
            this.alertSuccessMsg = 'تم حذف نوع الطلب  بنجاح. يمكنك المتابعة';
            this.alertSuccess = true;
            this.getData();
          } else {
            this.alertError = true;
            this.alertErrorMsg = res.errors[0].message;
          }
        });
    } else {
      this.alertConfirm = false;
    }
  }

  // ------------------------------------
  // Get All Project Status
  // ------------------------------------
  getData(paganations?: any) {
    this._requestTypeService
      .getAllVisitRequestTypes(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          this.tree = data.data.items;
          this.totalItemsCount = data.data.totalCount;

          if (
            this.isSearchingReasult == true ||
            (this.isSearchingReasult == false && this.tree.length != 0)
          ) {
            this.showBreadcrumb = true;
          } else {
            this.showBreadcrumb = false;
          }
          this.totalPageCount = data.data.totalCount;
        },
        (err) => {
          this.alertErrorMsg =
            'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getData();
    this.cols = [
      new listColumns({ field: 'name', header: 'اسم المهمة' }),
      new listColumns({ field: 'projectName', header: 'اسم المشروع' }),
      new listColumns({ field: 'taskCompletionRate', header: ' نسبة الإنجاز' }),
      new listColumns({
        field: 'isCompeleted',
        header: 'حالة المهمة ',
        statusClass: 'statues_task_colors',
        statusBadgeField: 'isCompeleted',
      }),
    ];
  }
  openWhenClickTd(value){
    this.openEdit(value)
  }
}
