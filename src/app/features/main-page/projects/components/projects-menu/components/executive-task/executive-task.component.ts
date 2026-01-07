import { Component } from '@angular/core';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { ProjectTaskService } from '../projects-tasks/services/project-task.service';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-executive-task',
  templateUrl: './executive-task.component.html',
  styleUrls: ['./executive-task.component.scss'],
})
export class ExecutiveTaskComponent {
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
  color: string = '#6466f1';
  isEditMode: boolean = false;
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
  // CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _projectTasksService: ProjectTaskService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) {}

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
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.filterDataParams!.filterType = 2;
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
