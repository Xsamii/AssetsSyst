import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { EvaluationTermsService } from './services/evaluation-terms.service';
import { EvaluationTermsEnum } from 'src/app/Shared/enums/evaluationTermsEnum';

@Component({
  selector: 'app-maintenance-evaluation-terms',
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
  templateUrl: './maintenance-evaluation-terms.component.html',
  styleUrls: ['./maintenance-evaluation-terms.component.scss']
})
export class MaintenanceEvaluationTermsComponent {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  evaluationTerms: any = [];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertFailureMessage: string = '';
  evaluationTermId: number = null;
  evaluationTermsEnum = EvaluationTermsEnum;

  constructor(
    private _evaluationTermsService: EvaluationTermsService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  evaluationTermsForm = this._fb.group({
    name: ['', Validators.required],
    typeId: [null as number | null, Validators.required],
    parentId: [null], 
  });

  get formControls() {
    return this.evaluationTermsForm.controls;
  }

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getAllMalfunctionsLookup() {
    this._sharedService.getMalfunctionTypes().subscribe((res) => {
      this.evaluationTerms = res.data;
    });
  }

  // ------------------------------------
  // GET ALL Evaluation Terms
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;

  getAllEvaluationTerms(paganations?: any) {
    this._evaluationTermsService
      .gettAllEvaluationTerms(paganations, this.searchValue)
      .subscribe(
        (data) => {
          this.values = data.data.items;
          this.values.map((e) => {
            e.classificationType == EvaluationTermsEnum.maintenanceContract
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
    this.getAllEvaluationTerms();
  }

  // ------------------------------------
  // UPDATE Evaluation Terms
  // ------------------------------------

  openAdd() {
    this.getAllMalfunctionsLookup();
    this.isEditMode = false;
    this.evaluationTermsForm.reset();
    // Explicitly reset the typeId to null to clear radio button selection
    this.evaluationTermsForm.patchValue({
      typeId: null
    });
    this.showAddEditPopup = true;
    this.evaluationTermId = null;
  }

  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.evaluationTermId = id;
    this._evaluationTermsService.getEvaluationTermById(id).subscribe((res) => {
      // Safely convert typeId to number or keep as null
      const typeId = res.data.typeId !== null && res.data.typeId !== undefined 
        ? Number(res.data.typeId) 
        : null;
        
      this.evaluationTermsForm.patchValue({
        name: res.data.name,
        typeId: typeId,
      });
    });
  }

  OnSubmitData() {
    const obj = {
      id: this.evaluationTermId,
      name: this.evaluationTermsForm.value.name,
      typeId: this.evaluationTermsForm.value.typeId,
    };

    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._evaluationTermsService.createEvaluationTerm(obj).subscribe(
        (res) => {
          if (res.isSuccess) {
            // Success case
            this.evaluationTermsForm.reset();
            this.evaluationTermsForm.patchValue({ typeId: null });
            this.getAllEvaluationTerms();
            this.showAddEditPopup = false;
            this.alertSuccess = true;
            this.alertSuccessMsg = 'تمت إضافة بند التقييم بنجاح إلى قائمة بنود تقييم الصيانة، يمكنك المتابعة';
          } else {
            // API validation error case
            this.alertError = true;
            this.alertFailureMessage = res.errors && res.errors.length > 0 
              ? res.errors[0].message 
              : 'حدث خطأ أثناء إضافة بند التقييم';
          }
        },
        (error) => {
          // Network error case
          console.error('Network error:', error);
          this.alertError = true;
          this.alertFailureMessage = 'حدث خطأ في الاتصال بالخادم';
        }
      );
    } else {
      // ---------FOR EDIT--------------
      this._evaluationTermsService.updateEvaluationTerm(obj).subscribe(
        (res) => {
          if (res.isSuccess) {
            // Success case
            this.evaluationTermsForm.reset();
            this.evaluationTermsForm.patchValue({ typeId: null });
            this.getAllEvaluationTerms();
            this.showAddEditPopup = false;
            this.alertSuccess = true;
            this.alertSuccessMsg = 'تم تعديل تفاصيل بند التقييم بنجاح، يمكنك المتابعة';
          } else {
            // API validation error case
            this.alertError = true;
            this.alertFailureMessage = res.errors && res.errors.length > 0 
              ? res.errors[0].message 
              : 'حدث خطأ أثناء تعديل بند التقييم';
          }
        },
        (error) => {
          // Network error case
          console.error('Network error:', error);
          this.alertError = true;
          this.alertFailureMessage = 'حدث خطأ في الاتصال بالخادم';
        }
      );
    }
  }

  // ------------------------------------
  // DELETE Evaluation Term
  // ------------------------------------
  confirmDelete(id) {
    this.evaluationTermId = id;
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
      this._evaluationTermsService
        .deleteEvaluationTerm(this.evaluationTermId)
        .subscribe((res) => {
          this.getAllEvaluationTerms();
          this.alertConfirm = false;
          if (res.isSuccess) {
            this.alertSuccess = true;
            this.alertSuccessMsg = 'تم حذف بند التقييم بنجاح من قائمة بنود تقييم الصيانة، يمكنك المتابعة';
          }
          else {
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

  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.evaluationTermsForm.reset();
    // Explicitly reset the typeId to null
    this.evaluationTermsForm.patchValue({
      typeId: null
    });
    this.alertWarning = true;
  }

  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getAllEvaluationTerms();
    this.getAllMalfunctionsLookup();
    this.cols = [
      new listColumns({ field: 'name', header: 'الاسم' }),
      new listColumns({ field: 'typeName', header: 'النوع' }),
    ];
  }

  
}