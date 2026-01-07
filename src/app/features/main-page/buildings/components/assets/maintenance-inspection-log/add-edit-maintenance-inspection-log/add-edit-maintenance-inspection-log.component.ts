import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { AssetsService } from '../../assets.service';
import { MaintenanceInspectionLogService } from '../maintenance-inspection-log.service';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { FilesService } from 'src/app/Shared/services/files.service';
import { File } from 'src/app/Shared/models/files';

@Component({
  selector: 'app-add-edit-maintenance-inspection-log',
  templateUrl: './add-edit-maintenance-inspection-log.component.html',
  styleUrls: ['./add-edit-maintenance-inspection-log.component.scss'],
  standalone: true,
  imports: [
    BreadCrumbComponent,
    DropdownModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
    CommonModule,
    SweetAlertMessageComponent,
    MultiSelectModule,
    CalendarModule,
    UploadFileComponent
  ],
})
export class AddEditMaintenanceInspectionLogComponent {
  // Properties
  maintenanceitemList;
  officesList;
  values;
  maintenanceInspectionLogForm: FormGroup;
  editeId!: number;
  editMode: boolean = false;
  subTitle: any[];
  filteredAssetNumber: number[] = [];
  regularmaintenanceitemList;
  filterDataParams = new FilterDataParams();

  // Status list
  statusList = [
    { status: true, name: 'يعمل' },
    { status: false, name: ' لا يعمل' },
  ];

  // Regular check types from API
  regularCheckTypesList: any[] = [];

  // Alert states
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;

  // Asset and office info
  assetName: string = '';
  officeName: string = '';

  @ViewChild('maintenanceDropdown') maintenanceDropdown!: Dropdown;

  // Enhanced MultiSelect properties (simplified)
  enhancedMaintenanceList: any[] = [];

  // STANDARDIZED File upload properties - keeping only what we need
  uploadedFiles: File[] = [];

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _assetService: AssetsService,
    private _MaintenanceInspectionLog: MaintenanceInspectionLogService,
    private _fileService: FilesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupRouteAndMode();
    this.loadInitialData();
  }

  private setupRouteAndMode(): void {
    if (this._router.url.includes('/buildings/assets/add-maintenance-inspection-log')) {
      this.editMode = false;
      this.subTitle = [
        { name: 'الرئيسية', routerLink: '/' },
        { name: 'إدارة الأصول', routerLink: '/buildings' },
        { name: 'سجل الكشف الدوري للصيانة', routerLink: '/buildings/assets/add-maintenance-inspection-log' },
      ];
      this.assetName = this._route.snapshot.queryParamMap.get('assetName') || '';
      this.editeId = Number(this._route.snapshot.queryParamMap.get('assetId'));
      this.maintenanceInspectionLogForm.get('assetId')?.setValue(this.editeId);
      this.getPickedFiles('/maintenance-inspection-log/add');
    } else {
      this.editMode = true;
      this.editeId = Number(this._route.snapshot.paramMap.get('id'));
      this.subTitle = [
        { name: 'الرئيسية', routerLink: '/' },
        { name: 'إدارة الأصول', routerLink: '/buildings' },
        { name: 'سجل الكشف الدوري للصيانة', routerLink: '/buildings/assets/edit-maintenance-inspection-log' },
      ];
      this.getDataById(this.editeId);
    }
  }

  private loadInitialData(): void {
    this.getRegularMaintenanceItemList();
    this.getOffice();
    this.getRegularCheckTypes();
  }

  initializeForm(): void {
    this.maintenanceInspectionLogForm = this._formBuilder.group({
      id: [0],
      assetId: [null, Validators.required],
      assetName: [null],
      regularMaintenanceItems: [null, Validators.required],
      isChecked: [null, Validators.required],
      checkDate: [null, Validators.required],
      contractorId: [null, Validators.required],
      notes: [null, Validators.required],
      regularCheckTypeId: [0],
      fileUploads: [null],
    });
  }

  // Load regular check types from API
  getRegularCheckTypes(): void {
    this._sharedService.getRegularCheckTypes().subscribe(
      (res) => {
        if (res.isSuccess && res.data) {
          this.regularCheckTypesList = res.data;
        }
      },
      (error) => {
        console.error('Error loading regular check types:', error);
        this.regularCheckTypesList = [];
      }
    );
  }

  // KEEPING YOUR EXISTING DATA PATCHING LOGIC - just standardizing file handling
  getDataById(id: number): void {
    this._MaintenanceInspectionLog.getMaintenanceInspectionLogById(id).subscribe((res) => {
      this.values = res.data;
      if (this.values) {
        // KEEPING YOUR EXISTING LOGIC - just adding standardized file handling
        this.patchData(this.values);
        this.assetName = this.values.asset.name;
        this.officeName = this.values.contractor?.name;
        this.enhancedMaintenanceList = this.values.maintenanceItems;

        // STANDARDIZED file handling - but keeping your existing approach
        this.getPickedFiles(`/maintenance-inspection-log/edit/${this.editeId}`);

        // Process existing files from API response - STANDARDIZED
        for (let index = 0; index < res.data.fileUploads.length; index++) {
          const element = res.data.fileUploads[index];
          this.uploadedFiles.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }

        // Set progress for existing files
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
      }
    });
  }

  // KEEPING YOUR EXISTING patchData method unchanged
  patchData(data: any): void {
    this.maintenanceInspectionLogForm.patchValue({
      id: data.id,
      assetId: data.asset.id,
      regularMaintenanceItems: data.maintenanceItems?.map((item) => item.id) || [],
      isChecked: data.isChecked,
      checkDate: data.checkDate ? new Date(data.checkDate) : null,
      contractorId: data.contractor?.id,
      notes: data.notes,
      regularCheckTypeId: data.regularCheckTypeId || 0,
    });
  }

  // STANDARDIZED getPickedFiles method - same as assets component
  getPickedFiles(pickedPath: string): void {
    this._fileService.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
        e.progress = 100;
        e.id = null;
      });

      if (this.editMode) {
        // Merge picked files with existing files
        this.uploadedFiles = [...res.data, ...this.uploadedFiles];
      } else {
        // For add mode, just use picked files
        this.uploadedFiles = [...res.data];
      }
    });
  }

  // KEEPING YOUR EXISTING getOffice method unchanged
  getOffice(): void {
    this._sharedService.GetOfficeOfAssetList(this.editeId).subscribe((res) => {
      this.officesList = res['data'] || {};
      this.maintenanceInspectionLogForm.get('contractorId')?.setValue(this.officesList.id);
      this.officeName = this.officesList?.name;
    });
  }

  // KEEPING YOUR EXISTING Enhanced Maintenance Items Methods unchanged
  getRegularMaintenanceItemList(searchTerm?: string, paganations?: any): void {
    this.filterDataParams.searchTerm = searchTerm;
    this.filterDataParams.AssetId = this.editeId;

    this._assetService.getRegularMaintenanceItemList(paganations, this.filterDataParams).subscribe((data) => {
      this.regularmaintenanceitemList = data.data.items;
      // Simply use the regular list without enhancements
      this.enhancedMaintenanceList = [...this.regularmaintenanceitemList];
    });
  }

  onDropdownFilter(event: any): void {
    const searchTerm = event.filter || '';
    this.getRegularMaintenanceItemList(searchTerm);
  }

  // ONLY updating file patching in onSubmit method
  onSubmit(): void {
    // STANDARDIZED: Patch files before submission
    this.maintenanceInspectionLogForm.patchValue({
      fileUploads: this.uploadedFiles,
    });

    if (this.editMode) {
      this._MaintenanceInspectionLog.editMaintenanceInspectionLog(this.maintenanceInspectionLogForm.value).subscribe(
        (res) => {
          if (res['isSuccess']) {
            this.alertSuccess = true;
            this.alertError = false;
            this.alertSuccessMsg = 'تمت تعديل سجل الكشف الدوري للصيانة بنجاح إلى قائمة سجل الكشف الدوري للصيانة، يمكنك المتابعة';
          } else {
            this.alertErrorMsg = res['errors'][0]?.message || 'حدث خطأ أثناء التعديل';
            this.alertError = true;
          }
        },
        (error) => {
          this.alertSuccess = false;
          this.alertError = true;
          this.alertErrorMsg = 'حدث خطأ أثناء التعديل';
        }
      );
    } else {
      this._MaintenanceInspectionLog.addMaintenanceInspectionLog(this.maintenanceInspectionLogForm.value).subscribe(
        (res) => {
          if (res['isSuccess']) {
            this.alertSuccess = true;
            this.alertError = false;
            this.maintenanceInspectionLogForm.reset();
            // Reset uploaded files after successful submission
            this.uploadedFiles = [];
            this.alertSuccessMsg = 'تمت اضافة سجل الكشف الدوري للصيانة بنجاح إلى قائمة سجل الكشف الدوري للصيانة يمكنك المتابعة';
          } else {
            this.alertErrorMsg = res['errors'][0]?.message || 'حدث خطأ أثناء الإضافة';
            this.alertError = true;
          }
        },
        (error) => {
          this.alertSuccess = false;
          this.alertError = true;
          this.alertErrorMsg = 'حدث خطأ أثناء الإضافة';
        }
      );
    }
  }

  // KEEPING YOUR EXISTING onCancle method - just adding file reset
  onCancle(): void {
    this.initializeForm();
    this.uploadedFiles = []; // Reset uploaded files
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
    this._router.navigateByUrl(returnUrl);
  }

  // KEEPING YOUR EXISTING routeToAssets method - just adding file reset
  routeToAssets(): void {
    this.initializeForm();
    this.uploadedFiles = []; // Reset uploaded files
    this._router.navigate(['/buildings/assets']);
  }

  // KEEPING YOUR EXISTING Alert Functions unchanged
  alertSuccessFun(value: boolean): void {
    if (value) {
      const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
      this._router.navigateByUrl(returnUrl);
    }
  }

  alertErrorFun(value: boolean): void {
    if (value) {
      this.alertError = false;
    }
  }
}
