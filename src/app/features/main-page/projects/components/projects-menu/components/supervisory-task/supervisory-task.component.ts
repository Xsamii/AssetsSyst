import { Component, OnInit } from '@angular/core';
import { ProjectTaskService } from '../projects-tasks/services/project-task.service';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';

@Component({
  selector: 'app-supervisory-task',
  templateUrl: './supervisory-task.component.html',
  styleUrls: ['./supervisory-task.component.scss'],
})
export class SupervisoryTaskComponent implements OnInit {
  userRole = +localStorage.getItem('maintainanceRole');

  // ------------------------------------
  // VALUES
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  totalPageCount!: number;
  searchValue!: string;
  isSearchingReasult: boolean = false;
  showBreadcrumb: boolean = true;
  currentTaskId: number;
  alertConfirm: boolean = false;
  alertSuccess: boolean = false;
  alertSuccessMsg: string;
  alertError: boolean = false;
  alertErrorMsg: string;
  alertWarning: boolean = false;
  color: string = '#6466f1';
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  taskId: number;
  projectsList: any;
  displayDialog: boolean = false;
  tasksStatusList = [
    { name: 'مكتملة', id: 1 },
    { name: 'غير مكتملة', id: 2 },
  ];
  projectTasksList;
  filterDataParams = new FilterDataParams();

  searchForm = this._fb.group({
    name: [],
    projectId: [],
    isCompeleted: [],
  });
  taskForm = this._fb.group({
    name: ['', Validators.required],
    projectId: ['', Validators.required],
    taskCompletionRate: ['', Validators.required],
    isCompeleted: [],
  });
  get formControls() {
    return this.taskForm.controls;
  }
  // ------------------------------------
  // FILTER
  // ------------------------------------
  showDialog() {
    this.searchForm.reset();
    this.displayDialog = true;
    this.getLookUps();
  }
  hideDialog() {
    // this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }
  taskStatusId;
  taskStatus;

  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];

    if (this.searchForm.value.name)
      this.filterDataParams.filterItems.push({
        key: 'Id',
        operator: 'equals',
        value: String(this.searchForm.value.name),
      });
    if (this.searchForm.value.projectId)
      this.filterDataParams.filterItems.push({
        key: 'projectId',
        operator: 'equals',
        value: String(this.searchForm.value.projectId),
      });
    if (this.searchForm.value.isCompeleted) {
      this.searchForm.value.isCompeleted === 1
        ? (this.searchForm.value.isCompeleted = true)
        : (this.searchForm.value.isCompeleted = false);
      this.filterDataParams.filterItems.push({
        key: 'isCompeleted',
        operator: 'equals',
        value: String(this.searchForm.value.isCompeleted),
      });
    }

    this.getAllProjectTasks();
    this.displayDialog = false;
  }
  submitSearchForm() {
    this.popupFilter();
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
    private _projectTasksService: ProjectTaskService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // ADD EDIT
  // ------------------------------------
  openAdd() {
    this.isEditMode = false;
    this.taskForm.reset();
    this.showAddEditPopup = true;
    this.taskId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.taskId = id;
    this._projectTasksService.getProjectTaskById(id).subscribe((res) => {
      this.taskForm.patchValue({
        name: res.data.name,
        projectId: res.data.projectId,
        taskCompletionRate: res.data.taskCompletionRate,
        isCompeleted: res.data.isCompeleted,
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.taskId,
      name: this.taskForm.value.name,
      projectId: this.taskForm.value.projectId,
      isCompeleted: this.taskForm.value.isCompeleted,
      taskCompletionRate: this.taskForm.value.taskCompletionRate,
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._projectTasksService.createProjectTask(obj).subscribe((res) => {
        this.taskForm.reset();
        this.getAllProjectTasks();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg =
          'تمت إضافة المهمة بنجاح إلى قائمة، المهام، يمكنك المتابعة';
      });
    } else {
      // ---------FOR EDIT--------------
      this._projectTasksService.updateProjectTask(obj).subscribe((res) => {
        this.taskForm.reset();
        this.getAllProjectTasks();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل المهمة بنجاح، يمكنك المتابعة';
      });
    }
  }
  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  getLookUps() {
    this._projectTasksService.getAllExecutiveProjects().subscribe((res) => {
      this.projectsList = res.data;
    });
    this._sharedService.getProjectTasks().subscribe((res) => {
      this.projectTasksList = res.data;
    });
  }
  // ------------------------------------
  // Get All Project Status
  // ------------------------------------
  getAllProjectTasks(paganations?: any) {
    this._projectTasksService
      .getAllProjectTasks(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          this.values = data.data.items;
          this.values.map((e) => {
            e.taskCompletionRate =
              e.taskCompletionRate == null
                ? e.taskCompletionRate
                : e.taskCompletionRate + '%';
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

    this.getAllProjectTasks();
  }

  // ------------------------------------
  // confirmDelete
  // ------------------------------------
  confirmDelete(id: number) {
    this.currentTaskId = id;
    this.alertConfirm = true;
  }
  alertConfirmFun(value: boolean) {
    if (value) {
      this._projectTasksService
        .deleteProjectTask(this.currentTaskId)
        .subscribe({
          next: () => {
            this.alertConfirm = false;
            this.alertSuccessMsg = 'تم حذف المهمة  بنجاح. يمكنك المتابعة';
            this.alertSuccess = true;
            this.getAllProjectTasks();
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
    this.filterDataParams!.filterType = 1;
    this.getAllProjectTasks();
    this.cols = [
      new listColumns({ field: 'name', header: 'اسم المهمة' }),
      new listColumns({ field: 'projectName', header: 'اسم المشروع' }),
      new listColumns({ field: 'taskCompletionRate', header: ' نسبة الإنجاز' }),
      new listColumns({
        field: 'isCompeleted',
        header: 'حالة المهمة ',
        statusClass: 'statues_task_colors',
        statusBadgeField: 'isCompeleted',
      }),
    ];
    this.getLookUps();
  }
}
