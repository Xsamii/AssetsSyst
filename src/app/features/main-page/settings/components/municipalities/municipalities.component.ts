import { Component } from '@angular/core';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { MunicipalitiesService } from './services/municipalities.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { FilterDataParams } from 'src/app/Shared/services/shared.service';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';

@Component({
  selector: 'app-municipalities',
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
  templateUrl: './municipalities.component.html',
  styleUrls: ['./municipalities.component.scss']
})
export class MunicipalitiesComponent {
  // ------------------------------------
  // VALUES
  // ------------------------------------
  items = []
  values: any[] = [];
  cols: any[] = [];
  municipalitiesTypeList = [
    { name: 'تابعة', id: 1 },
    { name: 'فرعية', id: 2 },
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

  municipalityId: number;
  municipalitiesForm = this._fb.group({
    name: ['', Validators.required],
    typeId: ['', Validators.required]
  });
  get formControls() {
    return this.municipalitiesForm.controls;
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
    private _MunicipalitiesService: MunicipalitiesService,
    private _fb: FormBuilder,

  ) { }


  // ------------------------------------
  // ADD EDIT
  // ------------------------------------
  openAdd() {
    this.isEditMode = false;
    this.municipalitiesForm.reset();
    this.showAddEditPopup = true;
    this.municipalityId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.municipalityId = id;
    this._MunicipalitiesService.getMunicipalityById(id).subscribe((res) => {
      this.municipalitiesForm.patchValue({
        name: res.data.name,
        typeId: res.data.typeId
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.municipalityId,
      name: this.municipalitiesForm.value.name,
      typeId: this.municipalitiesForm.value.typeId
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._MunicipalitiesService.createMunicipality(obj).subscribe((res) => {
        this.municipalitiesForm.reset();
        this.getData();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة البلدية بنجاح إلى قائمة البلديات، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._MunicipalitiesService.updateMunicipality(obj).subscribe((res) => {
        this.municipalitiesForm.reset();
        this.getData();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل البلدية بنجاح، يمكنك المتابعة';
      });
    }
  }
  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  // ------------------------------------
  // Get All Project Gategores
  // ------------------------------------
  getData(paganations?: any) {
    this._MunicipalitiesService
      .getAllMunicipalities(paganations, this.filterDataParams)
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
      this._MunicipalitiesService
        .deleteMunicipality(this.currentGategorieId)
        .subscribe({
          next: () => {
            this.alertConfirm = false;
            this.alertSuccessMsg = 'تم حذف البلدية بنجاح. يمكنك المتابعة';
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
      { name: 'الرئيسية', routerLink: '/settings/users' },
      { name: 'إدارة النظام', routerLink: '/settings/users' },
      { name: 'البلديات', routerLink: '/settings/municipalities' },
    ];
    this.getData();
    this.cols = [
      new listColumns({ field: 'name', header: 'اسم البلدية' }),
      new listColumns({ field: 'typeName', header: 'نوع البلدية' }),

    ];
  }
}
