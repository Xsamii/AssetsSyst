import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { UsersService } from './services/users.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    BreadCrumbComponent,
    NoDataYetComponent,
    CommonModule,
    ListComponent,
    SweetAlertMessageComponent,
    ReactiveFormsModule,
    DropdownModule,
    RadioButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  showBreadcrumb: boolean;
  items = [];
  currentId: number;
  isEdit: boolean = false;
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  filterDataParams = new FilterDataParams();
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  searchValue!: string;
  displayDialog: boolean = false;
  searchForm: FormGroup;
  userRole = +localStorage.getItem('maintainanceRole');
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _usersService: UsersService,
    private _sharedService: SharedService
  ) {
    this._activatedRoute.params.subscribe((params) => {
      this.currentId = params['id'];
      this.currentId != null ? (this.isEdit = true) : (this.isEdit = false);
    });
  }

  ngOnInit(): void {
    this.items = [
      { name: 'الرئيسية', routerLink: '/settings/users' },
      { name: 'إدارة النظام', routerLink: '/settings/users' },
      { name: 'المستخدمين', routerLink: '/settings/users' },
    ];
    this.cols = [
      new listColumns({ field: 'fullName', header: 'الاسم ' }),
      new listColumns({ field: 'email', header: 'البريد الإلكتروني' }),
      new listColumns({ field: 'mobile', header: 'رقم الهاتف' }),
      new listColumns({ field: 'nationId', header: 'رقم الهوية' }),
      new listColumns({
        field: 'roleName',
        header: 'المجموعة',
        isUserType: true,
        userType: 'userTypeId',
      }),
      // new listColumns({ field: 'inactive', header: 'حالة التنشيط', inactive: 'inactive' }),
    ];
    this.getData();
  }
  activateUser(value) {
    this._usersService.disableUser(value.id).subscribe((res) => {});
  }

  //=================================================
  // FILTERING
  //=================================================
  userTypeList;
  showDialog() {
    this.displayDialog = true;
    // this.searchForm.reset()
    this.initializeSearchForm();
    this._sharedService.getUserTypes().subscribe((res) => {
      if(this.userRole == 3){
        this.userTypeList = res.data.filter(userType => userType.id === 3 || userType.id === 4 ||userType.id === 5)
      }else{
        this.userTypeList = res.data;
      }
    });
  }
  OnSubmitData() {
    this.popupFilter();
  }
  initializeSearchForm() {
    this.searchForm = this._formBuilder.group({
      userTypeId: [],
      inActive: [],
    });
  }
  filterBySearchTesxt(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.searchForm.value.userTypeId)
      this.filterDataParams.filterItems.push({
        key: 'userTypeId',
        operator: 'equals',
        value: String(this.searchForm.value.userTypeId),
      });
    if (this.searchForm.value.inActive)
      this.filterDataParams.filterItems.push({
        key: 'Inactive',
        operator: 'equals',
        value: String(this.searchForm.value.inActive),
      });

    this.getData();
    this.displayDialog = false;
  }
  hideDialog() {
    this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }

  openAdd() {
    this._router.navigate(['settings/users/add']);
  }
  openEdit(event) {
    this._router.navigate(['settings/users/edit', event]);
  }
  userId: number;
  deleteBuilding(event) {
    this.userId = event;
    this.alertConfirm = true;
  }

  getData(paganations?: any) {
    this._usersService.getAllList(paganations, this.filterDataParams).subscribe(
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
        // this.alertError = true;
      }
    );
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
      // this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }
  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._usersService.deleteUser(this.userId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم حذف المستخدم بنجاح من قائمة المستخدمين، يمكنك المتابعة';
          this.getData();
        } else {
          this.alertConfirm = false;
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
}
