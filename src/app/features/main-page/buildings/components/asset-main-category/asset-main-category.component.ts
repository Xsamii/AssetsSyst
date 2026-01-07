import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { AssetsMainCategoryService } from './services/asset-main-category.service';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-asset-main-category',
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
  templateUrl: './asset-main-category.component.html',
  styleUrls: ['./asset-main-category.component.scss']
})
export class AssetMainCategoryComponent {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  assetTypeLookUp: any = [];
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
    private _assetMainCategoryService: AssetsMainCategoryService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  assetMainCategoryForm = this._fb.group({
    name: ['', Validators.required],
    assetTypeId: [null, Validators.required],

  });
  get formControls() {
    return this.assetMainCategoryForm.controls;
  }


  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getLookUps() {
    this._sharedService.getAllAssetTypes().subscribe((res) => {
      this.assetTypeLookUp = res.data;
    });
  }

  // ------------------------------------
  // GET ALL MAIN CATEGORIES
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  assetTypeIds: number[] = [];
  showBreadcrumb: boolean = true;
  getAllMainCategories(paganations?: any) {
    this._assetMainCategoryService
      .getAllMainCategories(paganations, this.searchValue, this.assetTypeIds)
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
    this.getAllMainCategories();
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.assetTypeIds = [];
    if (this.searchForm.value.assetTypeId)
      this.assetTypeIds.push(this.searchForm.value.assetTypeId);
    this.getAllMainCategories();
    this.displayDialog = false;
  }
  showDialog() {
    this.displayDialog = true;
    this.initializeSearchForm();
  }
  initializeSearchForm() {
    this.searchForm = this._fb.group({
      assetTypeId: [],
    });
  }
  search() {
    this.popupFilter();
  }
  hideDialog() {
    this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }
  // ------------------------------------
  // UPDATE  MAIN CATEGORY
  // ------------------------------------

  mainCategoryId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.assetMainCategoryForm.reset();
    this.showAddEditPopup = true;
    this.mainCategoryId = null;
    this.assetTypeIds = [];
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.mainCategoryId = id;
    this._assetMainCategoryService.getMainCategoryById(id).subscribe((res) => {
      this.assetMainCategoryForm.patchValue({
        name: res.data.name,
        assetTypeId: res.data.assetTypeId,
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.mainCategoryId,
      name: this.assetMainCategoryForm.value.name,
      assetTypeId: Number(this.assetMainCategoryForm.value.assetTypeId)
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._assetMainCategoryService.createMainCategory(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.assetMainCategoryForm.reset();
          this.getAllMainCategories();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة التصنيف الرئيسي بنجاح إلى قائمة التصنيفات الرئيسية، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._assetMainCategoryService.updateMainCategory(obj).subscribe((res) => {
        this.assetMainCategoryForm.reset();
        this.getAllMainCategories();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل التصنيف الرئيسي بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  confirmDelete(id) {
    this.mainCategoryId = id;
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
      this._assetMainCategoryService.deleteMainCategory(this.mainCategoryId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllMainCategories();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف التصنيف الرئيسي بنجاح من قائمة التصنيفات الرئيسية، يمكنك المتابعة';
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
    this.getAllMainCategories();
    this.getLookUps();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم التصنيف' }),
      new listColumns({ field: 'assetTypeName', header: 'النظام التابع له التصنيف' }),
    ];
  }
}
