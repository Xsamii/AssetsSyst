import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { MaintenanceRequestsService } from '../../services/maintenance-requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from 'src/app/Shared/services/files.service';
import { File } from 'src/app/Shared/models/files';
import { AssetsService } from 'src/app/features/main-page/buildings/components/assets/assets.service';

@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: './add-edit-maintenance.component.html',
  styleUrls: ['./add-edit-maintenance.component.scss'],
})
export class AddEditMaintenanceComponent implements OnInit {
  userRole = +localStorage.getItem('maintainanceRole');

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
  showGeoLocationDialog: boolean = false;
  selectedLatitude: string = '';
  selectedLongitude: string = '';
  builldingLookup: any[] = [];
  buildingSubUnitLookup: any = [];
  floorLookup: any = [];
  officesLookup: any = [];
  assetLookup: any = []
  visitRequestsStatusLookup: any = [];
  requestPrioretyLookup: any = [];
  primaryMaintenanceTypeLookup: any = [];
  subMaintenanceTypeLookup: any = [];
  maintenanceConsultingProjectsLookup: any = [];
  maintenanceExecutiveProjectsLookup: any = [];
  statusId: number = 1;
  assetId: number;
  asset: any;

  // Updated to use API data instead of hardcoded array
  maintenanceTypes: any[] = [];

  //#endregion END VALUES

  // ------------------------------------
  // CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private _maintenanceRequestsService: MaintenanceRequestsService,
    private _router: Router,
    private _activetedRoute: ActivatedRoute,
    private _fileService: FilesService,
    private _assetService: AssetsService,
  ) { }

  // ------------------------------------
  // FORM
  // ------------------------------------
  maintenanceForm = this._fb.group({
    buildingId: ['', Validators.required],
    assetNumber: [''],
    floorId: [null],
    officeId: [null],
    assetId: [null],
    mainCategoryType: ['', Validators.required],
    subCategoryType: ['', Validators.required],
    maintenanceRequestStatusId: [''],
    requestPriorety: ['', Validators.required],
    proplemDescription: [''],
    fileUploads: this._fb.array([]),
    supervisorProjectId: [''],
    executableProjectId: [''],
    isReviewed: [],
    lat: [''],
    lng: [''],
    locationDescription: [''],
    credentials: [''],
    // maintenanceTypeId: [''],
  });

  get formControls() {
    return this.maintenanceForm.controls;
  }

  // ------------------------------------
  //  ON SUBMIT
  // ------------------------------------
  onSubmit() {
    if (this.statusId == 1) {
      const obj = {
        id: +this.editeId,
        subCategoryType: +this.maintenanceForm.value.subCategoryType,
        proplemDescription: this.maintenanceForm.value.proplemDescription,
        buildingId: +this.maintenanceForm.value.buildingId,
        requestPriorety: +this.maintenanceForm.value.requestPriorety,
        fileUploads: this.uploadedFiles,
        supervisorProjectId: +this.maintenanceForm.value.supervisorProjectId,
        executableProjectId: +this.maintenanceForm.value.executableProjectId,
        maintenanceRequestStatusId:
          +this.maintenanceForm.value.maintenanceRequestStatusId,
        isReviewed: this.maintenanceForm.value.isReviewed,
         lng: this.maintenanceForm.value.lng || '',
        lat: this.maintenanceForm.value.lat || '',
        officeId: +this.maintenanceForm.value.officeId,
      };
      const crerateObj = {
        subCategoryType: +this.maintenanceForm.value.subCategoryType,
        proplemDescription: this.maintenanceForm.value.proplemDescription,
        buildingId: +this.maintenanceForm.value.buildingId,
        credentials: this.maintenanceForm.value.credentials || '',
        officeId: +this.maintenanceForm.value.officeId,
        requestPriorety: +this.maintenanceForm.value.requestPriorety,
        locationDescription: this.maintenanceForm.value.locationDescription || '',
        // maintenanceTypeId: this.maintenanceForm.value.maintenanceTypeId ? +this.maintenanceForm.value.maintenanceTypeId : 0,
        lng: this.maintenanceForm.value.lng || '',
        lat: this.maintenanceForm.value.lat || '',
        fileUploads: this.uploadedFiles,
      };

      if (!this.editMode) {
        this._maintenanceRequestsService
          .createMaintenanceRequest(crerateObj)
          .subscribe((res) => {
            if (res.isSuccess) {
              this.alertSuccess = true;
              this.alertSuccessMsg =
                'تمت إضافة طلب الصيانة بنجاح إلى قائمة طلبات الصيانة، يمكنك المتابعة';
            } else {
              this.alertErrorMsg = res.errors[0].message;
              this.alertError = true;
            }
          });
      } else {
        this._maintenanceRequestsService
          .updateMaintenanceRequest(obj)
          .subscribe((res) => {
            if (res.isSuccess) {
              this.alertSuccess = true;
              this.alertSuccessMsg =
                'تم تعديل تفاصيل طلب الصيانة بنجاح، يمكنك المتابعة';
            } else {
              this.alertErrorMsg = res.errors[0].message;
              this.alertError = true;
            }
          });
      }
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
        this.getMaintenanceById();
      } else {
        this.editMode = false;
      }
    });
  }

  getMaintenanceById() {
    this._maintenanceRequestsService
      .getMaintenanceById(this.editeId)
      .subscribe((res) => {
        this.statusId = res.data.maintenanceRequestStatusId;

        // Handle file uploads
        this.uploadedFiles = res.data.fileUploads;
        this.maintenanceFiles = res.data.fileUploads;
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
        this.maintenanceFiles.forEach((e) => {
          e.id = null;
        });

        this.getPickedFiles(`/maintenace-requests/edit/${this.editeId}`);
        for (let index = 0; index < res.data.fileUploads.length; index++) {
          const element = res.data.fileUploads[index];
          this.filesArr.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }

        // Patch form values
        this.maintenanceForm.patchValue({
          mainCategoryType: res.data.mainCategoryTypeId,
          subCategoryType: res.data.subCategoryType,
          proplemDescription: res.data.proplemDescription,
          buildingId: res.data.buildingId,
          requestPriorety: res.data.requestPriorety,
          maintenanceRequestStatusId: res.data.maintenanceRequestStatusId,
          supervisorProjectId: res.data.supervisorProjectId,
          executableProjectId: res.data.executableProjectId,
          floorId: res.data.floorId,
          officeId: res.data.buildingOfficeId,
        });

        // Patch latitude and longitude
        if (res.data.lat) {
          this.selectedLatitude = res.data.lat.toString();
        }
        if (res.data.lng) {
          this.selectedLongitude = res.data.lng.toString();
        }

        // Load dependent data
        if (res.data.buildingId) {
          // Load floors and offices from the combined API
          this.getAlloffices(res.data.buildingId);

          // If there's a specific floor selected, get offices for that floor
          if (res.data.floorId) {
            // Wait a bit for floors to load, then get specific floor offices
            setTimeout(() => {
              this.getOfficesForFloor(res.data.floorId);
            }, 500);
          }
        }

        // Load maintenance sub-types
        this.getMaintTypesByParent(res.data.mainCategoryTypeId);
      });
  }

  onReviwed() {
    (this.maintenanceForm.value.isReviewed = true),
      (this.maintenanceForm.value.maintenanceRequestStatusId = '2');
  }

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getAllBuildingLookup() {
    this._maintenanceRequestsService.getAllBuildingForMaintenanceRequest().subscribe((res) => {
      this.builldingLookup = res.data;
    });
  }

  getAllBuildingSubUnit(id: number) {
    this._sharedService.getAllBuildingSubUnit(id).subscribe((res) => {
      this.buildingSubUnitLookup = res.data;
    });
  }

  getVisitRequestsStatus() {
    this.visitRequestsStatusLookup =
      this._sharedService.getVisitRequestsStatus();
  }

  getRequestPriorety() {
    this.requestPrioretyLookup = this._sharedService.getRequestPriorety();
  }

  getAllPrimaryMaintenanceType() {
    this._sharedService.getAllPrimaryMaintenanceType().subscribe((res) => {
      this.primaryMaintenanceTypeLookup = res.data;
    });
  }

  getMaintTypesByParent(id: number) {
    this._sharedService.getMaintTypesByParent(id).subscribe((res) => {
      this.subMaintenanceTypeLookup = res.data;
    });
  }

  getMaintenanceConsultingProjects() {
    this._sharedService.getMaintenanceConsultingProjects().subscribe((res) => {
      this.maintenanceConsultingProjectsLookup = res.data;
    });
  }

  getMaintenanceExecutiveProjects() {
    this._sharedService.getMaintenanceExecutiveProjects().subscribe((res) => {
      this.maintenanceExecutiveProjectsLookup = res.data;
    });
  }

  // Get both floors and offices from the combined API
  getAlloffices(buildingId: number) {
    this._sharedService.GetFloorOrBuildingOffices(buildingId).subscribe((res: any) => {
      if (res.isSuccess) {
        this.officesLookup = res.data.offices || [];
        this.floorLookup = res.data.floors || [];
      } else {
        this.officesLookup = [];
        this.floorLookup = [];
      }
    });
  }

  // Get offices for a specific floor
  getOfficesForFloor(floorId: number) {
    this._sharedService.getOfficesInFloor(floorId).subscribe((res) => {
      this.officesLookup = res.data || [];
    });
  }

  // Handle building change
  onBuildingChange(buildingId: number) {
    if (buildingId) {
      // Reset dependent fields
      this.maintenanceForm.patchValue({
        floorId: null,
        officeId: null
      });

      // Clear dependent lookups
      this.floorLookup = [];
      this.officesLookup = [];

      // Single API call to get both floors and offices for the building
      this.getAlloffices(buildingId);
    }
  }

  // Handle floor change
  onFloorChange(floorId: number) {
    if (floorId) {
      // Reset office selection
      this.maintenanceForm.patchValue({
        officeId: null
      });

      // Get offices for this specific floor
      this.getOfficesForFloor(floorId);
    } else {
      // If floor is cleared, show all building offices again
      const buildingId = this.maintenanceForm.value.buildingId;
      if (buildingId) {
        this.getAlloffices(+buildingId);
      }
    }
  }

  getAllAssetsInOffice(id: number) {
    this._sharedService.GetAllAssetsBySearch(id).subscribe((res) => {
      this.assetLookup = res.data;
    });
  }

  // Load maintenance types from API
  getMaintenanceTypes() {
    this._sharedService.getMaintenanceTypes().subscribe((res) => {
      if (res.isSuccess && res.data) {
        this.maintenanceTypes = res.data;
      }
    }, (error) => {
      console.error('Error loading maintenance types:', error);
      // Fallback to hardcoded values if API fails
      this.maintenanceTypes = [
        { id: 1, name: 'تصحيحي' },
        { id: 2, name: 'وقائي' },
        { id: 3, name: 'دوري' }
      ];
    });
  }

  // ------------------------------------
  // GEO-LOCATION DIALOG FUNCTIONS
  // ------------------------------------
  openGeoLocationDialog() {
    this.showGeoLocationDialog = true;
  }

  onDialogShow() {
    // Dialog is now visible, component will initialize
  }

  onLocationSelected(location: { lat: string; lng: string }) {
    this.selectedLatitude = location.lat;
    this.selectedLongitude = location.lng;
    this.maintenanceForm.patchValue({
      lat: location.lat,
      lng: location.lng
    });
    this.showGeoLocationDialog = false;
  }

  onGeoLocationCancel() {
    this.showGeoLocationDialog = false;
  }

  // ------------------------------------
  // ALERTS FUNCTIONS
  // ------------------------------------
  onCancle() {
    this.alertWarning = true;
  }

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/maintenance/maintenace-requests']);
    }
  }

  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/maintenance/maintenace-requests']);
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
    this.onEdit();
    // LOOKUPS
    this.getAllBuildingLookup();
    this.getVisitRequestsStatus();
    this.getRequestPriorety();
    this.getAllPrimaryMaintenanceType();
    this.getMaintenanceConsultingProjects();
    this.getMaintenanceExecutiveProjects();
    this.getMaintenanceTypes();

    this.editeId != null
      ? this.getMaintenanceById()
      : this.getPickedFiles('maintenace-requests/add');

    // Get from asset to add request
    if (this._router.url.includes('maintenance/maintenace-requests/addFromAssets')) {
      this._activetedRoute.params.subscribe((params) => {
        this.assetId = params['assetId'];
      });
      this.getDataByIdForAsset(this.assetId);
    }
  }

  getDataByIdForAsset(id) {
    this._assetService.getAssetById(id).subscribe((res) => {
      this.asset = res.data;
      if (res.isSuccess) {
        this.maintenanceForm.patchValue({
          buildingId: this.asset?.building?.id,
          floorId: this.asset?.floor?.id,
          officeId: this.asset?.office?.id,
        });

        if (this.asset?.building?.id) {
          this.getAlloffices(this.asset.building.id);

          if (this.asset?.floor?.id) {
            setTimeout(() => {
              this.getOfficesForFloor(this.asset.floor.id);
            }, 500);
          }
        }
      }
    });
  }
}
