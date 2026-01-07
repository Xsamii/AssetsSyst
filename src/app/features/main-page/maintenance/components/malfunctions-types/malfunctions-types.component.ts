import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { MalfunctionsService } from './services/malfunctions.service';
import { MalfunctionTypeEnum } from 'src/app/Shared/enums/malfunctionTypesEnum';
import { DropdownModule } from 'primeng/dropdown';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-malfunctions-types',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    NoDataYetComponent,
    SweetAlertMessageComponent,
    ReactiveFormsModule,
    RadioButtonModule,
    FormsModule,
    DropdownModule,
    CheckboxModule
  ],
  templateUrl: './malfunctions-types.component.html',
  styleUrls: ['./malfunctions-types.component.scss'],
})
export class MalfunctionsTypesComponent implements OnInit {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  malfunctions: any = [];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  malfunctionTypesEnum = MalfunctionTypeEnum;
  alertFailureMessage: string = '';
  malfunctionType;
  constructor(
    private _malfunctionTypesService: MalfunctionsService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // i coyped this code from subunits (CHANGE THEM)
  // -----------------------------------
  // FORM
  // -----------------------------------
  malfunctionTypeForm = this._fb.group({
    name: ['', Validators.required],
    classificationType: [, Validators.required],
    parentID: [null],
    isRevised: [],
  });
  get formControls() {
    return this.malfunctionTypeForm.controls;
  }

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getAllMalfunctionsLookup() {
    this._sharedService.getMalfunctionTypes().subscribe((res) => {
      this.malfunctions = res.data;
    });
  }
  // ------------------------------------
  // GET ALL malfunction types
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  getAllMalfunctionTypes(paganations?: any) {
    this._malfunctionTypesService
      .gettAllMalfunctionTypes(paganations, this.searchValue)
      .subscribe(
        (data) => {
          this.values = data.data.items;
          this.values.map((e) => {
            e.classificationType == MalfunctionTypeEnum.primary
              ? (e.classificationType = 'رئيسي')
              : (e.classificationType = 'فرعي');
          });
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
  filterBySearchTesxt(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.getAllMalfunctionTypes();
  }
  // ------------------------------------
  // UPDATE malfunction types
  // ------------------------------------

  malfunctionId: number = null;
  openAdd() {
    this.getAllMalfunctionsLookup();
    this.isEditMode = false;
    this.malfunctionTypeForm.reset();
    this.showDropDown = false;
    this.showAddEditPopup = true;
    this.malfunctionId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.malfunctionId = id;
    this._malfunctionTypesService.getMalfunctionById(id).subscribe((res) => {
      this.changeType(res.data.classificationType);
      this.malfunctionTypeForm.patchValue({
        name: res.data.name,
        classificationType: res.data.classificationType,
        parentID: res.data.parentID,
        isRevised: res.data.isRevised
      });
    });
  }
  showDropDown: boolean = false;
  changeType(e) {
    if (e == MalfunctionTypeEnum.secondary) {
      this.showDropDown = true;
    } else {
      this.showDropDown = false;
      this.malfunctionTypeForm.get('parentID').reset();
    }
  }
  OnSubmitData() {
    const obj = {
      id: this.malfunctionId,
      name: this.malfunctionTypeForm.value.name,
      classificationType: this.malfunctionTypeForm.value.classificationType,
      parentID:
        this.malfunctionTypeForm.value.parentID == 0
          ? null
          : this.malfunctionTypeForm.value.parentID,
      isRevised: this.malfunctionTypeForm.value.isRevised,
    };

    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._malfunctionTypesService.createMalfunction(obj).subscribe((res) => {
        this.malfunctionTypeForm.reset();
        this.getAllMalfunctionTypes();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة نوع العطل بنجاح إلى قائمة  أنواع الأعطال، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._malfunctionTypesService.updateMalfunction(obj).subscribe((res) => {
        this.malfunctionTypeForm.reset();
        this.getAllMalfunctionTypes();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تم تعديل تفاصيل نوع العطل بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE malfunctionTypes
  // ------------------------------------
  confirmDelete(id) {
    this.malfunctionId = id;
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
      this._malfunctionTypesService
        .deleteMalfunction(this.malfunctionId)
        .subscribe((res) => {
          this.getAllMalfunctionTypes();
          this.alertConfirm = false;
          if (res.isSuccess) {
            this.alertSuccess = true;
          }
          else {
            this.alertError = true;
            this.alertFailureMessage = res.errors[0].message;
          }
          this.alertSuccessMsg =
            'تم حذف نوع العطل بنجاح من قائمة  أنواع الأعطال، يمكنك المتابعة';
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

  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getAllMalfunctionTypes();
    this.getAllMalfunctionsLookup();
    this.cols = [
      new listColumns({ field: 'name', header: 'اسم النوع' }),
      new listColumns({ field: 'classificationType', header: 'نوع العطل' }),
      new listColumns({ field: 'parentName', header: 'النوع الرئيسي' }),
    ];
    this.changeValidations();
  }

  // ==================================================
  // Create Validations for classification Type value
  // ==================================================
  private changeValidations(): void {
    this.malfunctionTypeForm
      .get('classificationType')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(100))
      .subscribe((value) => {
        const parentID = this.malfunctionTypeForm.get('parentID');
        const validators = [Validators.required];

        if (value == 1) {
          parentID?.clearValidators();
        } else if (value == 2) {
          parentID?.setValidators(validators);
        }
        parentID?.updateValueAndValidity();
      });
  }
}
