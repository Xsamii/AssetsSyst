import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/Shared/services/files.service';
import { ContractorsService } from '../services/contractors.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { File } from 'src/app/Shared/models/files';
@Component({
  selector: 'app-add-edit-contractor',
  templateUrl: './add-edit-contractor.component.html',
  styleUrls: ['./add-edit-contractor.component.scss'],
})
export class AddEditContractorComponent implements OnInit {
  // ------------------------------------
  //  VALUES
  // ------------------------------------
  uploadedFiles: File[] = [];
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  editMode: boolean = false;
  currentOfficeId!: number;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  projectTypeList = [{ name: 'استشاري'  , value : 1 }, { name: 'تنفيذي', value :2 }];
  // ------------------------------------
  //  SWEET ALERTS FUNCTIONS
  // ------------------------------------
  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/settings/contractros']);
    }
  }
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/settings/contractros']);
    } else {
      this.alertWarning = false;
    }
  }
  // ------------------------------------
  //  CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _fileService: FilesService,
    private _contractorsService: ContractorsService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}
  // ------------------------------------
  //  FORM
  // ------------------------------------
  officeForm = this._fb.group({
    name: ['', Validators.required],
    officeRegistrationNumber: ['', Validators.required],
    description: ['', Validators.required],
    officeTypeId: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    nationId: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    fileUploads: this._fb.array([]),
  });
  get formControls() {
    return this.officeForm.controls;
  }

  // ------------------------------------
  //  GET OFFICE BY ID
  // ------------------------------------
  getOfficeById() {
    this._contractorsService
      .getOfficeById(this.currentOfficeId)
      .subscribe((res) => {
        // ------------------------------------
        // ------------------------------------
        this.uploadedFiles = res.data.fileUploads;
        this.officeFiles = res.data.fileUploads;
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
        this.officeFiles.forEach((e) => {
          e.id = null;
        });
        // -------------
        this.getPickedFiles(
          `/settings/contractros/edit/${this.currentOfficeId}`
        );
        for (let index = 0; index < res.data.fileUploads.length; index++) {
          const element = res.data.fileUploads[index];
          this.filesArr.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }
        // ------------------------------------
        // ------------------------------------
        this.officeForm.patchValue({
          name: res.data.name,
          officeRegistrationNumber: res.data.officeRegistrationNumber,
          description: res.data.description,
          officeTypeId: res.data.officeTypeId,
          fullName: res.data.officeUserDto.fullName,
          email: res.data.officeUserDto.email,
          mobile: res.data.officeUserDto.mobile,
          nationId: res.data.officeUserDto.nationId,
        });
      });
  }
  // ------------------------------------
  //  CREATE & UPDATE OFFICE
  // ------------------------------------
  onSubmit() {
    // OBJECT
    const obj = {
      id: this.editMode ? this.currentOfficeId : null,
      name: this.officeForm.value.name,
      officeRegistrationNumber: this.officeForm.value.officeRegistrationNumber,
      description: this.officeForm.value.description,
      officeTypeId: this.officeForm.value.officeTypeId,
      officeUserDto: {
        fullName: this.officeForm.value.fullName,
        email: this.officeForm.value.email,
        mobile: this.officeForm.value.mobile,
        nationId: this.officeForm.value.nationId,
      },
      fileUploads: this.uploadedFiles,
    };
    // CREATE
    if (!this.editMode) {
      this._contractorsService.createOffice(obj).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertSuccessMsg =
              'تمت إضافة المقاول بنجاح إلى قائمة المقاولين، يمكنك المتابعة';
            this.alertSuccess = true;
          } else {
            this.alertErrorMsg = res.errors[0].message;
            this.alertError = true;
          }
        },
        error: () => {
          this.alertErrorMsg =
            'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
        },
      });
    } else {
      // UPDATE
      this._contractorsService.updateOffice(obj).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertSuccessMsg =
              'تم تعديل تفاصيل المقاول بنجاح، يمكنك المتابعة';
            this.alertSuccess = true;
          } else {
            this.alertErrorMsg = res.errors[0].message;
            this.alertError = true;
          }
        },
        error: () => {
          this.alertErrorMsg =
            'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
        },
      });
    }
  }
  // ------------------------------------
  //  PICKED FILES
  // ------------------------------------
  officeFiles;
  getPickedFiles(pickedPath) {
    this._fileService.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
        e.progress = 100;
      });
      if (this.editMode) {
        this.uploadedFiles = [...res.data, ...this.officeFiles];
      } else {
        this.uploadedFiles = [...res.data];
      }
    });
  }

  // ------------------------------------
  // ON EDIT MODE
  // ------------------------------------
  onEdit() {
    this._activatedRoute.params.subscribe((params) => {
      this.currentOfficeId = params['id'];
      if (this.currentOfficeId) {
        this.editMode = true;
        this.getOfficeById();
      } else {
        this.editMode = false;
      }
    });

    this.currentOfficeId != null
      ? this.getOfficeById()
      : this.getPickedFiles('settings/contractros/add');
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.onEdit();
  }
}
