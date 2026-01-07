import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { MonthlyReportService } from '../monthly-report.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-setting-monthly-report',
  templateUrl: './setting-monthly-report.component.html',
  styleUrls: ['./setting-monthly-report.component.scss'],
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
    CheckboxModule,
    NgSelectModule,
  ],
})
export class SettingMonthlyReportComponent implements OnInit {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertFailureMessage: string = '';

  showMonthlyPopup: boolean = false;
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  TabForm!: FormGroup;
  tabList!: any[];
  minData!: any[];
  tabweebId: number;
  editMode: boolean = false;
  constructor(
    private MonthlyReportService: MonthlyReportService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cols = [
      new listColumns({ field: 'id', header: '# ' }),
      new listColumns({ field: 'name', header: ' اسم التبويب ' }),
      new listColumns({ field: 'taweebType', header: ' نوع التبويب' }),
    ];
    this.createTabForm();
    this.getList();
    this.getAllTab();
  }
  createTabForm() {
    this.TabForm = this.fb.group({
      tabType: ['تبويب رئيسي'],
      name: [null, Validators.required],
      parentId: [null],
      id: [null],
      tabweebType: true,
    });
    this.changeTabType();
  }
  changeTabType() {
    this.TabForm.get('tabType')?.valueChanges.subscribe((value) => {
      const parentControl = this.TabForm.get('parentId');
      if (value === 'تبويب فرعي') {
        parentControl?.setValidators(Validators.required);
        this.TabForm.get('tabweebType')?.setValue(false);
        this.TabForm.get('name')?.reset();
      } else {
        parentControl?.clearValidators();
        this.TabForm.get('name')?.reset();
        this.TabForm.get('tabweebType')?.setValue(true);
        this.TabForm.get('parentId')?.reset();
      }

      parentControl?.updateValueAndValidity();
    });
  }
  getList(paganations?: any) {
    this.MonthlyReportService.getAllList(
      paganations,
      this.searchValue
    ).subscribe(
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

  getAllTab() {
    this.MonthlyReportService.GetMainTabweebLookUp().subscribe({
      next: (res: any) => {
        this.tabList = res.data ?? [];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  filterBySearchTesxt(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.getList();
  }
  deleteMonthlyReport(id: number) {
    this.alertConfirm = true;
    this.tabweebId = id;
  }

  toggleMonthlyReportPopup() {
    this.showMonthlyPopup = !this.showMonthlyPopup;
    this.editMode = false;
    this.createTabForm();
  }

  GetMainTabweebDataByID(id: number) {
    this.MonthlyReportService.GetTabweebById(id).subscribe({
      next: (res: any) => {
        this.minData = res.data ?? [];
        this.confirmUpdateMonthlyReport(this.minData);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  updateTabweeb(id: number) {
    this.showMonthlyPopup = !this.showMonthlyPopup;
    this.editMode = true;
    this.GetMainTabweebDataByID(id);
  }
  confirmUpdateMonthlyReport(Tabweeb: any) {
    if (Tabweeb.parentId == null) {
      this.TabForm.patchValue({
        tabType: 'تبويب رئيسي',
        name: Tabweeb.name,
        parentId: Tabweeb.parentId,
        id: Tabweeb.id,
      });
    } else {
      this.TabForm.patchValue({
        tabType: 'تبويب فرعي',
        name: Tabweeb.name,
        parentId: Tabweeb.parentId,
        id: Tabweeb.id,
      });
    }
  }
  async saveTab() {
    if (
      this.editMode &&
      this.TabForm.controls['tabType'].value == 'تبويب رئيسي'
    ) {
      this.TabForm.patchValue({
        tabType: 'تبويب رئيسي',
        name: this.TabForm.controls['name'].value,
        parentId: null,
        id: this.TabForm.controls['id'].value,
      });
    }

    let res = this.editMode
      ? await firstValueFrom(
          this.MonthlyReportService.editTabweeb(this.TabForm.value)
        )
      : await firstValueFrom(
          this.MonthlyReportService.addTabweeb(this.TabForm.value)
        );
    if (res.isSuccess) {
      this.showMonthlyPopup = false;
      this.getList();
      this.getAllTab();
      this.createTabForm();
    }
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
      this.MonthlyReportService.deleteTabweeb(this.tabweebId).subscribe(
        (res) => {
          this.getList();
          this.alertConfirm = false;
          if (res.isSuccess) {
            this.alertSuccess = true;
          } else {
            this.alertError = true;
            this.alertFailureMessage = res.errors[0].message;
          }
          this.alertSuccessMsg ='تم حذف التبويب  بنجاح، يمكنك المتابعة'
              }
      );
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
}
