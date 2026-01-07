import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { UsersService } from '../services/users.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@Component({
  selector: 'app-users-add-edit',
  standalone: true,
  imports: [
    BreadCrumbComponent,
    DropdownModule,
    CalendarModule,
    CommonModule,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    DirectivesModule,
  ],
  templateUrl: './users-add-edit.component.html',
  styleUrls: ['./users-add-edit.component.scss'],
})
export class UsersAddEditComponent {
  items = [];
  currentId: number;
  isEdit: boolean = false;
  formData: FormGroup;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.items = [
      { name: 'الرئيسية', routerLink: '/settings/users' },
      { name: 'إدارة النظام', routerLink: '/settings/users' },
      { name: 'المستخدمين', routerLink: '/settings/users' },
      {
        name: this.isEdit ? ' تعديل المستخدم' : ' إضافة مستخدم',
        routerLink: this.isEdit
          ? '/settings/users/edit/' + this.currentId
          : '/settings/users/add',
      },
    ];
    this.getDropDowns();
    this.initializeForm();
    this.currentId != null ? this.getUserDatabyId() : '';

    this.changeValidations();
  }

  initializeForm() {
    this.formData = this._formBuilder.group({
      id: [null],
      fullName: [
        ,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      mobile: [, [Validators.required, Validators.minLength(10)]],
      nationId: [, [Validators.required, Validators.minLength(10)]],
      jobId: [],
      jobName: [],
      dateOfBirth: [],
      email: [, [Validators.required, Validators.email]],
      userTypeId: [, [Validators.required]],
      officeId: [],
    });
  }

  getUserDatabyId() {
    this._usersService.getUserById(this.currentId).subscribe((res) => {
      this.showOfficeList(res.data.userTypeId);
      this.formData.patchValue({
        ...res.data,
        dateOfBirth: res.data.dateOfBirth
          ? new Date(res.data.dateOfBirth)
          : null,
      });
    });
  }

  // patchData() {

  // }

  submit() {
    if (this.formData.invalid) {
      Object.keys(this.formData.controls).forEach((field) => {
        const control = this.formData.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    // update
    else if (this.isEdit) {
      this._usersService.editUser(this.formData.value).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم تعديل تفاصيل المستخدم بنجاح، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
    // add
    else {
      this._usersService.addUser(this.formData.value).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة المستخدم بنجاح إلى قائمة المستخدمين، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
  }
  cancel() {
    this.alertWarning = true
    // this._router.navigate(['settings']);
  }
  userTypeList;
  officeList;
  getDropDowns() {
    forkJoin({
      userTypeListReq: this._usersService.getUserType(),
      officeListReq: this._sharedService.getOfficeList(),
    }).subscribe(({ userTypeListReq, officeListReq }) => {
      this.userTypeList = userTypeListReq.data;
      this.officeList = officeListReq.data;
    });
  }
  showOffice: boolean = false;
  showOfficeList(val) {
    this.showOffice = val === 5 || val === 3 || val === 4 ? true : false;
  }

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/settings']);
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/settings']);
    } else {
      this.alertWarning = false;
    }
  }

  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

  // ==================================================
  // Create Validations for classification Type value
  // ==================================================
  private changeValidations(): void {
    this.formData
      .get('userTypeId')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(100))
      .subscribe((value) => {
        const officeId = this.formData.get('officeId');
        const validators = [Validators.required];

        if (value == 3 || value == 4 || value == 5) {
          officeId?.setValidators(validators);
        } else {
          officeId?.clearValidators();
        }
        officeId?.updateValueAndValidity();
      });
  }
}
