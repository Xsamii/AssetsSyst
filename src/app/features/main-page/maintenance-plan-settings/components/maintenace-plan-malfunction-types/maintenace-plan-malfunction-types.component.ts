import { Component } from '@angular/core';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { MaintenacePlanMalfunctionTypesService } from './services/maintenace-plan-malfunction-types.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { FilterDataParams } from 'src/app/Shared/services/shared.service';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';

@Component({
  selector: 'app-maintenace-plan-malfunction-types',
  standalone: true,
  imports: [
    CommonModule,
    SweetAlertMessageComponent,
    ListComponent,
    DropdownModule,
    BreadCrumbComponent,
    ReactiveFormsModule,
    NoDataYetComponent
  ],
  templateUrl: './maintenace-plan-malfunction-types.component.html',
  styleUrls: ['./maintenace-plan-malfunction-types.component.scss']
})
export class MaintenacePlanMalfunctionTypesComponent {
  // ------------------------------------
  // VALUES
  // ------------------------------------
  items = []
  values: any[] = [];
  cols: any[] = [];
  malfunctionTypesList = [
    { name: 'صيانة', id: 1 },
    { name: 'نظافة', id: 2 },
  ];
  totalPageCount!: number;
  searchValue!: string;
  isSearchingReasult: boolean = false;
  showBreadcrumb: boolean = true;
  currentGategorieId: number;
  alertConfirm: boolean = false;
  alertSuccess: boolean = false;
  alertSuccessMsg: string;
  alertError: boolean = false;
  alertErrorMsg: string;
  alertWarning: boolean = false;
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  filterDataParams = new FilterDataParams()

  malfunctionTypeId: number;
  malfunctionTypesForm = this._fb.group({
    maintTypeId: ['', Validators.required],
    code: ['', Validators.required]
  });
  get formControls() {
    return this.malfunctionTypesForm.controls;
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

  // ------------------------------------
  // CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _MalfunctionTypesService: MaintenacePlanMalfunctionTypesService,
    private _fb: FormBuilder,

  ) { }


  // ------------------------------------
  // ADD EDIT
  // ------------------------------------
  openAdd() {
    this.isEditMode = false;
    this.malfunctionTypesForm.reset();
    this.showAddEditPopup = true;
    this.malfunctionTypeId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.malfunctionTypeId = id;
    this._MalfunctionTypesService.getMalfunctionTypeById(id).subscribe((res) => {
      this.malfunctionTypesForm.patchValue({
        maintTypeId: res.data.maintTypeId,
        code: res.data.code
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.malfunctionTypeId,
      maintTypeId: this.malfunctionTypesForm.value.maintTypeId,
      code: this.malfunctionTypesForm.value.code
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._MalfunctionTypesService.createMalfunctionType(obj).subscribe((res) => {
        this.malfunctionTypesForm.reset();
        this.getData();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة نوع العطل بنجاح إلى قائمة أنواع الأعطال، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._MalfunctionTypesService.updateMalfunctionType(obj).subscribe((res) => {
        this.malfunctionTypesForm.reset();
        this.getData();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل نوع العطل بنجاح، يمكنك المتابعة';
      });
    }
  }
  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  // ------------------------------------
  // Get All Malfunction Types
  // ------------------------------------
  getData(paganations?: any) {
    this._MalfunctionTypesService
      .getAllMalfunctionTypes(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          this.values = data.data.items;

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
          // this.alertErrorMsg =
          //   'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          // this.alertError = true;
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
  // confirmDelete
  // ------------------------------------
  confirmDelete(id: number) {
    this.currentGategorieId = id;
    this.alertConfirm = true;
  }
  alertConfirmFun(value: boolean) {
    if (value) {
      this._MalfunctionTypesService
        .deleteMalfunctionType(this.currentGategorieId)
        .subscribe({
          next: () => {
            this.alertConfirm = false;
            this.alertSuccessMsg = 'تم حذف نوع العطل بنجاح. يمكنك المتابعة';
            this.alertSuccess = true;
            this.getData();
          },
          error: () => { },
        });
    } else {
      this.alertConfirm = false;
    }
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.items = [
      { name: 'الرئيسية', routerLink: '/' },
      { name: 'إعدادات خطة الصيانة', routerLink: '/maintenance-plan-settings/maintenace-plan' },
      { name: 'أنواع الأعطال', routerLink: '/maintenance-plan-settings/maintenace-plan-malfunction-types' },
    ];
    this.getData();
    this.cols = [
      new listColumns({ field: 'maintTypeName', header: 'التصنيف' }),
      new listColumns({ field: 'code', header: 'الكود' }),

    ];
  }
}
