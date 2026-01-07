import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { AssetsSubCategoryService } from './services/asset-sub-category.service';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-asset-sub-category',
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
  templateUrl: './asset-sub-category.component.html',
  styleUrls: ['./asset-sub-category.component.scss']
})
export class AssetSubCategoryComponent {
showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  mainCategoryLookUp: any = [];
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
    private _assetSubCategoryService: AssetsSubCategoryService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  subCategoryForm = this._fb.group({
    name: ['', Validators.required],
    categoryId: [null, Validators.required],
    assetTypeId: [null, Validators.required],

  });
  get formControls() {
    return this.subCategoryForm.controls;
  }


  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getCategoriesLookUp(id: number) {
    this._sharedService.getAllAssetTypesMainCategories(id).subscribe((res) => {
      this.mainCategoryLookUp = res.data;
    });
  }
 getAssetTypeLookUp() {
    this._sharedService.getAllAssetTypes().subscribe((res) => {
      this.assetTypeLookUp = res.data;
    });
  }
  // ------------------------------------
  // GET ALL FLOOORS
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  assetTypeIds: number[] = [];
  categoryIds: number[] = [];
  showBreadcrumb: boolean = true;
  getAllSubCategories(paganations?: any) {
    this._assetSubCategoryService
      .getAllSubCategories(paganations, this.searchValue, this.assetTypeIds, this.categoryIds)
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
    this.getAllSubCategories();
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.assetTypeIds = [];
    this.categoryIds = [];
    if (this.searchForm.value.categoryId)
      this.categoryIds.push(this.searchForm.value.categoryId);
    if (this.searchForm.value.assetTypeId)
      this.assetTypeIds.push(this.searchForm.value.assetTypeId);
    this.getAllSubCategories();
    this.displayDialog = false;
  }
  showDialog() {
    this.displayDialog = true;
    this.initializeSearchForm();
  }
  initializeSearchForm() {
    this.searchForm = this._fb.group({
      categoryId: [],
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
  // UPDATE  FLOOR
  // ------------------------------------

  subCategoryId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.subCategoryForm.reset();
    this.showAddEditPopup = true;
    this.subCategoryId = null;
    this.mainCategoryLookUp = [];
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.subCategoryId = id;
    this._assetSubCategoryService.getSubCategoryById(id).subscribe((res) => {
      this.subCategoryForm.patchValue({
        name: res.data.name,
        categoryId: res.data.categoryId,
        assetTypeId: res.data.assetTypeId
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.subCategoryId,
      name: this.subCategoryForm.value.name,
      categoryId: Number(this.subCategoryForm.value.categoryId),
      assetTypeId: Number(this.subCategoryForm.value.assetTypeId)
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._assetSubCategoryService.createSubCategory(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.subCategoryForm.reset();
          this.getAllSubCategories();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة التصنيف الفرعي بنجاح إلى قائمة التصنيفات الفرعية، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._assetSubCategoryService.updateSubCategory(obj).subscribe((res) => {
        this.subCategoryForm.reset();
        this.getAllSubCategories();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل التصنيف الفرعي بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  confirmDelete(id) {
    this.subCategoryId = id;
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
      this._assetSubCategoryService.deleteSubCategory(this.subCategoryId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllSubCategories();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف التصنيف الفرعي بنجاح من قائمة التصنيفات الفرعية، يمكنك المتابعة';
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
    this.getAllSubCategories();
    this.getAssetTypeLookUp();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'الاسم ' }),
      new listColumns({ field: 'categoryName', header: 'التصنيف الرئيسي' }),
    ];
  }
}
