import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { FilesService } from 'src/app/Shared/services/files.service';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { PiecesService } from '../../services/pieces.service';
import { File } from 'src/app/Shared/models/files';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@Component({
  selector: 'app-pieces-add-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SweetAlertMessageComponent,
    UploadFileComponent,
    DropdownModule,
    BreadCrumbComponent,
    DirectivesModule
  ],
  templateUrl: './pieces-add-edit.component.html',
  styleUrls: ['./pieces-add-edit.component.scss']
})
export class PiecesAddEditComponent {


  // ------------------------------------
  // VALUES
  // ------------------------------------
  //#region VALUES
  uploadedFiles: File[] = [];
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
  editeId!: number;
  editMode: boolean = false;
  toggleReviwed: boolean = false;
  maintenanceFiles;

  pieceMeasuringUnit: any = [];
  inventoryCategory: any = [];
  primaryMaintenanceTypeLookup: any = [];
  subMaintenanceTypeLookup: any = [];
  maintenanceConsultingProjectsLookup: any = [];
  maintenanceExecutiveProjectsLookup: any = [];
  breadcrumbTitle: string = 'إضافة قطعة ';
  breadCrumbLink: string = '/inventory/pieces/add';
  //#endregion END VALUES
  // ------------------------------------
  // CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private _PiecesService: PiecesService,
    private _router: Router,
    private _activetedRoute: ActivatedRoute,
    private _fileService: FilesService
  ) {}

  // ------------------------------------
  // FORM
  // ------------------------------------
  PiecesForm = this._fb.group({
    id: [],
    name: ['', Validators.required],
    code: ['', Validators.required],
    quantity: ['', Validators.required],
    classificationId: ['', Validators.required],
    inventoryItemUnitId: ['', Validators.required],
    description: [''],
    fileUploads: this._fb.array([]),

  });
  get formControls() {
    return this.PiecesForm.controls;
  }

  // ------------------------------------
  //  ON SUBMIT
  // ------------------------------------
  onSubmit() {

      const obj = {
        id:  this.editeId?+this.editeId: null,
        name: this.PiecesForm.value.name,
        code: this.PiecesForm.value.code,
        quantity: this.PiecesForm.value.quantity,
        classificationId: this.PiecesForm.value.classificationId,
        inventoryItemUnitId: +this.PiecesForm.value.inventoryItemUnitId,
        description: this.PiecesForm.value.description,
        fileUploads: this.uploadedFiles,

      };

      if (!this.editMode) {
        this._PiecesService
          .createPiece(obj)
          .subscribe((res) => {
            if (res.isSuccess) {
              this.alertSuccess = true;
              this.alertSuccessMsg =
                'تمت إضافة القطعة بنجاح إلى قائمة القطع, يمكنك المتابعة';
            } else {
              this.alertErrorMsg = res.errors[0].message;

              this.alertError = true;
            }
          });
      } else {
        this._PiecesService
          .updatePiece(obj)
          .subscribe((res) => {
            if (res.isSuccess) {
              this.alertSuccess = true;
              this.alertSuccessMsg =
                'تم تعديل القطعة بنجاح، يمكنك المتابعة';
            } else {
              this.alertErrorMsg = res.errors[0].message;

              this.alertError = true;
            }
          });
      }

  }
  // ------------------------------------
  //  ON EDIT
  // ------------------------------------
  onEdit() {
    this._activetedRoute.params.subscribe((params) => {
      this.editeId = params['id'];
      if (this.editeId) {
        this.editMode = true;
        this.breadcrumbTitle = 'تعديل القطعة';
        this.breadCrumbLink = '/inventory/pieces/edit/' + this.editeId;

        this.getPieceById();
      } else {
        this.editMode = false;
      }
    });
  }
  getPieceById() {
    this._PiecesService
      .getPieceById(this.editeId)
      .subscribe((res) => {

        // ------------------------------------
        // ------------------------------------
        this.uploadedFiles = res.data.fileUploads;
        this.maintenanceFiles = res.data.fileUploads;
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
        this.maintenanceFiles.forEach((e) => {
          e.id = null;
        });
        // -------------
        this.getPickedFiles(`/pieces/edit/${this.editeId}`);
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
        this.PiecesForm.patchValue({
          id: res.data.id,
          name: res.data.name,
          code: res.data.code,
          quantity: res.data.quantity,
          classificationId: res.data.classificationId,
          inventoryItemUnitId: res.data.inventoryItemUnitId,
          description: res.data.description,
        });

      });
  }

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------

  getPieceMeasuringUnit() {
    this._sharedService.getInventoryMeasuringUnits().subscribe(res=>{
      this.pieceMeasuringUnit = res['data']
    });
  }
  getInventoryCategory() {
   this._sharedService.getAllInventoryCategories().subscribe(res=>{
    this.inventoryCategory = res['data']
   });
  }



  // ------------------------------------
  // ALERTS FUNCTIONS
  // ------------------------------------
  onCancle() {
    this.alertWarning = true;
  }

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/inventory/pieces']);
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/inventory/pieces']);
    } else {
      this.alertWarning = false;
    }
  }

  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  // ------------------------------------
  //  PICKED FILES
  // ------------------------------------
  getPickedFiles(pickedPath) {
    this._fileService.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
        e.progress = 100;
        e.id = null;
      });
      if (this.editMode) {
        this.uploadedFiles = [...res.data, ...this.maintenanceFiles];
      } else {
        this.uploadedFiles = [...res.data];
      }
    });
  }
  // ------------------------------------
  //   ONINIT
  // ------------------------------------
  ngOnInit(): void {

    this.getPieceMeasuringUnit();
    this.getInventoryCategory();
    this.onEdit();
    this.editeId != null
      ? this.getPieceById()
      : this.getPickedFiles('pieces/add');
  }
}
