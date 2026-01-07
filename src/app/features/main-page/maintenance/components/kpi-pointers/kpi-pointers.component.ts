import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { KpiPointersService } from './services/kpi-pointers.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';

@Component({
  selector: 'app-kpi-pointers',
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
  templateUrl: './kpi-pointers.component.html',
  styleUrls: ['./kpi-pointers.component.scss']
})
export class KpiPointersComponent {
 showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  alertSuccess: boolean = false;
  displayDialog: boolean = false;
  filterDataParams = new FilterDataParams();
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertErrorMsg: string = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
  constructor(
    private _kpiPointersService: KpiPointersService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  kpiPointersForm = this._fb.group({
    name: ['', Validators.required],
    actualValue: [null, Validators.required],
    targetValue: [null, Validators.required],
  });
  get formControls() {
    return this.kpiPointersForm.controls;
  }

  // ------------------------------------
  // GET ALL FLOOORS
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  getAllPointers(paganations?: any) {
    this._kpiPointersService
      .getAllKpiPointers(paganations, this.filterDataParams)
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
    this.getAllPointers();
  }

  // ------------------------------------
  // UPDATE  FLOOR
  // ------------------------------------

  kpiPointerId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.kpiPointersForm.reset();
    this.showAddEditPopup = true;
    this.kpiPointerId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.kpiPointerId = id;
    this._kpiPointersService.getKpiPointerById(id).subscribe((res) => {
      this.kpiPointersForm.patchValue({...res.data
      });
    });
  }
  OnSubmitData() {

    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._kpiPointersService.createKpiPointer(this.kpiPointersForm.value).subscribe((res) => {
        if (res.isSuccess) {
          this.kpiPointersForm.reset();
          this.getAllPointers();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة مؤشر الأداء بنجاح إلى قائمة مؤشرات الأداء، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._kpiPointersService.updateKpiPointer(this.kpiPointersForm.value).subscribe((res) => {
        this.kpiPointersForm.reset();
        this.getAllPointers();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل مؤشر الأداء بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  confirmDelete(id) {
    this.kpiPointerId = id;
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
      this._kpiPointersService.deleteKpiPointer(this.kpiPointerId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllPointers();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف مؤشر الأداء بنجاح من قائمة مؤشرات الأداء، يمكنك المتابعة';
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
    this.getAllPointers();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم المؤشر' }),
      new listColumns({ field: 'targetValue', header: 'المستهدف', isPercentage:true }),
      new listColumns({ field: 'actualValue', header: 'المحقق', isPercentage:true  }),

    ];
  }
}
