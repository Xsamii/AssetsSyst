import { Component } from '@angular/core';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { ProjectsStatusService } from './services/projects-status.service';
import { CommonModule } from '@angular/common';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';

@Component({
  selector: 'app-projects-status',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    SweetAlertMessageComponent,
    ReactiveFormsModule,
    ColorPickerModule,
    NoDataYetComponent,
  ],
  templateUrl: './projects-status.component.html',
  styleUrls: ['./projects-status.component.scss'],
})
export class ProjectsStatusComponent {
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
  color: string = '#6466f1';
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  statusId: number;
  statusForm = this._fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    ],
    color: ['', Validators.required],
  });
  get formControls() {
    return this.statusForm.controls;
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
    private _projectsStatusService: ProjectsStatusService,
    private _fb: FormBuilder
  ) {}

  // ------------------------------------
  // ADD EDIT
  // ------------------------------------
  openAdd() {
    this.isEditMode = false;
    this.statusForm.reset();
    this.showAddEditPopup = true;
    this.statusId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.statusId = id;
    this._projectsStatusService.getProjectStatusById(id).subscribe((res) => {
      this.statusForm.patchValue({
        name: res.data.name,
        color: res.data.color,
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.statusId,
      name: this.statusForm.value.name,
      color: this.statusForm.value.color,
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._projectsStatusService.createProjectStatus(obj).subscribe((res) => {
        this.statusForm.reset();
        this.getAllProjectStatue();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة الحالة بنجاح إلى قائمة، الحالات، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._projectsStatusService.updateProjectStatus(obj).subscribe((res) => {
        this.statusForm.reset();
        this.getAllProjectStatue();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل الحالة بنجاح، يمكنك المتابعة';
      });
    }
  }
  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  // ------------------------------------
  // Get All Project Status
  // ------------------------------------
  getAllProjectStatue(paganations?: any) {
    this._projectsStatusService
      .getAllProjectStatue(paganations, this.searchValue)
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
    this.getAllProjectStatue();
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
      this._projectsStatusService
        .deleteProjectStatue(this.currentGategorieId)
        .subscribe({
          next: () => {
            this.alertConfirm = false;
            this.alertSuccessMsg = 'تم حذف الحاله  بنجاح. يمكنك المتابعة';
            this.alertSuccess = true;
            this.getAllProjectStatue();
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
    this.getAllProjectStatue();
    this.cols = [
      new listColumns({ field: 'name', header: 'الاسم' }),
      new listColumns({ field: 'color', header: 'اللون', isColor: true }),
    ];
  }
}
