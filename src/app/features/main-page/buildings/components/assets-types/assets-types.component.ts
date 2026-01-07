import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { AssetsTypesService } from './services/assets-types.service';

@Component({
  selector: 'app-assets-types',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    NoDataYetComponent,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    DropdownModule
  ],
  templateUrl: './assets-types.component.html',
  styleUrls: ['./assets-types.component.scss']
})
export class AssetsTypesComponent {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  alertSuccess: boolean = false;
  displayDialog: boolean = false;
  searchForm: FormGroup;
  filterDataParams = new FilterDataParams();
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertErrorMsg: string = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
  constructor(
    private _assetsTypesService: AssetsTypesService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  assetTypeForm = this._fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],

  });
  get formControls() {
    return this.assetTypeForm.controls;
  }



  // ------------------------------------
  // GET ALL ASSETS TYPES
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  getAllAssetTypes(paganations?: any) {
    this._assetsTypesService
      .getAllAssetTypes(paganations, this.searchValue)
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
          this.alertError = true;
        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllAssetTypes();
  }

  // ------------------------------------
  // UPDATE  ASSET TYPE
  // ------------------------------------

  assetTypeId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.assetTypeForm.reset();
    this.showAddEditPopup = true;
    this.assetTypeId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.assetTypeId = id;
    this._assetsTypesService.getAssetTypeById(id).subscribe((res) => {
      this.assetTypeForm.patchValue({
        name: res.data.name,
        code: res.data.code
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.assetTypeId,
      name: this.assetTypeForm.value.name,
      code: this.assetTypeForm.value.code
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._assetsTypesService.createAssetType(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.assetTypeForm.reset();
          this.getAllAssetTypes();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة النظام بنجاح إلى قائمة الأنظمة، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._assetsTypesService.updateAssetType(obj).subscribe((res) => {
        this.assetTypeForm.reset();
        this.getAllAssetTypes();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل النظام بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  confirmDelete(id) {
    this.assetTypeId = id;
    this.alertConfirm = true;
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
      this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }
  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._assetsTypesService.deleteAssetType(this.assetTypeId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllAssetTypes();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف النظام بنجاح من قائمة الأنظمة، يمكنك المتابعة';
          this.alertConfirm = false;

        } else {
          this.alertConfirm = false;
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
  }
  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getAllAssetTypes();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'الاسم ' }),
      new listColumns({ field: 'code', header: 'الكود' }),
    ];
  }
}
