import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PartsService } from '../../services/parts.service';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { File } from 'src/app/Shared/models/files';
import { StatusParts } from 'src/app/Shared/enums/status-parts';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';

@Component({
  selector: 'app-add-update-parts',
  standalone: true,
  imports: [DirectivesModule, BreadCrumbComponent, FormsModule, AutoCompleteModule, TableModule, ButtonModule, CommonModule, DropdownModule, UploadFileComponent, SweetAlertMessageComponent, ReactiveFormsModule],
  templateUrl: './add-update-parts.component.html',
  styleUrls: ['./add-update-parts.component.scss'],
})
export class AddUpdatePartsComponent {
  partsForm: FormGroup;
  Allparts: any;
  rowGroup: FormGroup;
  uploadedFileName: string = '';
  id: number;
  editMode: boolean = false;
  quantityProjectTable: any[] = [];
  maxFileSize = 16 * 1024 * 1024;
  fileTooBig: boolean = false;
  uploadedFiles: File[] = [];
  currentparts: any;
  CurrentuantityProjectTable: any;
  editeId!: number;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
  Allids: any;
  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private PartsService: PartsService,
    private sharedServices: SharedService
  ) { }
  ngOnInit(): void {
    this.createPartsForm();
    this.GetAllParts();
    if (this._router.url == '/buildings/parts-requests/create') {
      this.editMode = false;
    } else if (
      this._route.snapshot.paramMap.has('orderNumber')

    ) {
      this.editMode = false;
      // this.partsForm
      //   .get('maintenanceRequestId')
      //   ?.setValue(this._route.snapshot.paramMap.get('id')); 
      this.x = {id:this._route.snapshot.paramMap.get('id'), name: this._route.snapshot.paramMap.get('orderNumber')};


    } else {
      this.id = Number(this._route.snapshot.paramMap.get('id'));
      this.getDataById(this.id);
      this.editMode = true;
    }
  }

  createPartsForm() {
    this.partsForm = this.fb.group({
      notes: ['', Validators.required],
      piecesRequested: this.fb.array([]),
      files: [this.uploadedFiles],
      id: [null],
    });
    this.partsForm
      .get('maintenanceRequestId')
      ?.valueChanges.subscribe((value) => {
        const numericValue = Number(value);
        this.partsForm.patchValue(
          { maintenanceRequestId: numericValue },
          { emitEvent: false }
        );
      });
  }

  onKeyDown(event: KeyboardEvent) {
    // Allow backspace, delete, arrow keys, and other special keys
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    // If the key is not allowed and is not a numeric key, prevent it
    if (!allowedKeys.includes(event.key) && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }

  }


  // Getter for rows FormArray
  get ItemsQuantitiesRows(): FormArray {
    return this.partsForm.get('piecesRequested') as FormArray;
  }
  addItemQuantity(): void {
    this.ItemsQuantitiesRows.push(this.CreateItemQuantity());
  }
  // Method to create ItemQuantity FormGroup
  CreateItemQuantity(): FormGroup {
    const group = this.fb.group({
      id: [0],
      pieceId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
    });
    this.listenForChanges(group);

    return group;
  }

  // Listen for changes
  listenForChanges(formGroup: FormGroup): void {
    formGroup.get('quantity')?.valueChanges.subscribe((value) => {
      const numericValue = Number(value);
      formGroup.patchValue({ quantity: numericValue }, { emitEvent: false });
    });
  }

  deleteRow(index: number) {
    this.ItemsQuantitiesRows.removeAt(index);
  }

  GetAllParts() {
    this.sharedServices.GetAllInventoryPiece().subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.Allparts = res.data;
        } else {
          console.error('Failed to fetch projects: ', res.errors);
          this.Allparts = [];
        }
      },
      error: (err) => {
        console.error('Error fetching projects: ', err);
      },
    });
  }






x
  getMaintenanceRequest(id: any) {
    this.PartsService.MaintenanceRequestAutoCompleteIds(id).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {

          this.Allids = res.data;
        } else {
          console.error('Failed to fetch projects: ', res.errors);
          this.Allparts = [];
        }
      },
      error: (err) => {
        console.error('Error fetching projects: ', err);
      },
    });
  }
  onChangeids(event) {
    let id = +event.query;

    this.getMaintenanceRequest(id);
  }
  //handle update mode
  getDataById(id: number): void {
    this.PartsService.getById(id).subscribe((data) => {
      const partsData = data?.data;

      if (partsData) {
        this.currentparts = partsData;
        this.uploadedFiles = this.currentparts.files;
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
        this.x = {id:partsData.maintenanceRequestId, name: partsData.maintenanceRequestOrderNumber};
        this.UpdateMainExtractFormData(partsData);
      }
    });
  }
  private UpdateMainExtractFormData(partsData: any): void {
    this.partsForm.patchValue({
      ...partsData,
      notes: partsData.notes,
      maintenanceRequestId: partsData.maintenanceRequestId,
      files: this.uploadedFiles,
      id: this.id,
    });


    this.ItemsQuantitiesRows.clear();

    partsData.piecesRequested.forEach((item) => {
      const rowGroup = this.createQuantityRowGroup(item);
      if (partsData.statusId == StatusParts.WaitingApproval) {
        rowGroup.controls['pieceId'].enable();
      }
      this.ItemsQuantitiesRows.push(rowGroup);
    });

    this.partsForm.get('maintenanceRequestId').disable();
  }

  private createQuantityRowGroup(item: any): FormGroup {
    const rowGroup = this.fb.group({
      pieceId: [{ value: item.pieceId, disabled: true }],
      quantity: [item.quantity],
      id: [item.id],
    });
    this.listenForChanges(rowGroup);
    return rowGroup;
  }

  //shared in add update
  onSubmit() {
    const formValue = this.partsForm.getRawValue();
let object = {
  maintenanceRequestId: this.x.id,
  ...formValue
}
    if (this.editMode) {
      this.PartsService.editPart(object).subscribe(
        (res) => {
          if (res['isSuccess']) {
            this.alertSuccess = true;
            this.alertError = false;
            this.quantityProjectTable = [];
            this.alertSuccessMsg =
              'تمت تعديل طلب قطع الغيار بنجاح إلى قائمة طلبات القطع، يمكنك المتابعة';
          } else {
            this.alertErrorMsg = res['errors'][0].message;
            this.alertError = true;
          }
        },
        (error) => {
          this.alertSuccess = false;
          this.alertError = true;
        }
      );
    } else {
      this.PartsService.addPart(object).subscribe(
        (res) => {
          if (res['isSuccess']) {
            this.alertSuccess = true;
            this.alertError = false;
            this.partsForm.reset();
            this.quantityProjectTable = [];
            this.alertSuccessMsg =
              'تمت اضافة  طلب قطع الغيار بنجاح إلى قائمة طلبات القطع، يمكنك المتابعة';
          } else {
            this.alertErrorMsg = res['errors'][0].message;
            this.alertError = true;
          }
        },
        (error) => {
          this.alertSuccess = false;
          this.alertError = true;
        }
      );
    }
  }

  // ------------------------------------
  // ALERTS FUNCTIONS
  // ------------------------------------
  onCancle() {
    this.alertWarning = true;
  }

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/buildings/parts-requests']);
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/buildings/parts-requests']);
    } else {
      this.alertWarning = false;
    }
  }

  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
}
