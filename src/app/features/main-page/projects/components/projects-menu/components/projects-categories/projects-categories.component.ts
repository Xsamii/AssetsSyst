import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ProjectGategoriesService } from './services/project-gategories.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';

@Component({
  selector: 'app-projects-categories',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    SweetAlertMessageComponent,
    ReactiveFormsModule,
    NoDataYetComponent,
  ],
  templateUrl: './projects-categories.component.html',
  styleUrls: ['./projects-categories.component.scss'],
})
export class ProjectsCategoriesComponent implements OnInit {
  // ------------------------------------
  // VALUES
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
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
  classificationId: number;
  classificationForm = this._fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    ],
  });
  get formControls() {
    return this.classificationForm.controls;
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
    private _projectGategoriesService: ProjectGategoriesService,
    private _fb: FormBuilder
  ) {}

  // ------------------------------------
  // ADD EDIT
  // ------------------------------------
  openAdd() {
    this.isEditMode = false;
    this.classificationForm.reset();
    this.showAddEditPopup = true;
    this.classificationId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.classificationId = id;
    this._projectGategoriesService
      .getClassificationById(id)
      .subscribe((res) => {
        this.classificationForm.patchValue({
          name: res.data.name,
        });
      });
  }
  OnSubmitData() {
    const obj = {
      id: this.classificationId,
      name: this.classificationForm.value.name,
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._projectGategoriesService.createCategory(obj).subscribe((res) => {
        this.classificationForm.reset();
        this.getAllProjectGategories();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة التصنيف بنجاح إلى قائمة التصنيفات، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._projectGategoriesService.updateCategory(obj).subscribe((res) => {
        this.classificationForm.reset();
        this.getAllProjectGategories();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل التصنيف بنجاح، يمكنك المتابعة';
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
  getAllProjectGategories(paganations?: any) {
    this._projectGategoriesService
      .getAllProjectGategories(paganations, this.searchValue)
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
    this.getAllProjectGategories();
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
      this._projectGategoriesService
        .deleteProjectGategore(this.currentGategorieId)
        .subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.alertConfirm = false;
              this.alertSuccessMsg = 'تم حذف التصنيف بنجاح. يمكنك المتابعة';
              this.alertSuccess = true;
              this.getAllProjectGategories();
            } else {
              this.alertErrorMsg = res.errors[0].message;
              this.alertError = true;
              this.alertConfirm = false;
            }
          },
          error: () => {},
        });
    } else {
      this.alertConfirm = false;
    }
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getAllProjectGategories();
    this.cols = [
      new listColumns({ field: 'number', header: '#' }),

      new listColumns({ field: 'name', header: 'اسم التصنيف' })
    ];
  }
}
