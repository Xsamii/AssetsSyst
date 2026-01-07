import { GoogleMapsModule } from '@angular/google-maps';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MainBuildingsService } from '../services/main-buildings.service';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { forkJoin } from 'rxjs';
import { FilesService } from 'src/app/Shared/services/files.service';
import { File, UploadFiles } from 'src/app/Shared/models/files';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';

@Component({
  selector: 'app-main-buildings-add-edit',
  standalone: true,
  imports: [
    BreadcrumbModule,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    UploadFileComponent,
    GoogleMapsModule,
    BreadCrumbComponent,
    SweetAlertMessageComponent,
  ],
  templateUrl: './main-buildings-add-edit.component.html',
  styleUrls: ['./main-buildings-add-edit.component.scss'],
})
export class MainBuildingsAddEditComponent {
  formData: FormGroup;
  currentId: number;
  selectedPoint: string = '';
  isEdit: boolean;
  mainBuildingData;
  zoom = 12;
  hybrid = google.maps.MapTypeId.HYBRID;
  center: google.maps.LatLngLiteral = {
    lat: 21.4225,
    lng: 39.8262,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  markerPositions: google.maps.LatLngLiteral;
  items = [];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
  executiveList;
  consultingList;
  sitesList;
  uploadedFiles: File[] = [];
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _mainBuildingsService: MainBuildingsService,
    private _sharedService: SharedService,
    private _router: Router,
    private _fileService: FilesService
  ) {
    this._activatedRoute.params.subscribe((params) => {
      this.currentId = params['id'];
      this.currentId != null ? (this.isEdit = true) : (this.isEdit = false);
    });
  }

  ngOnInit() {
    this.items = [
      { name: 'الرئيسية', routerLink: '/' },
      { name: 'إدارة الأصول', routerLink: '/buildings' },
      { name: 'المباني', routerLink: '/buildings/main-buildings' },
      {
        name: this.isEdit ? 'تعديل المبنى' : 'إضافة مبنى',
        routerLink: this.isEdit
          ? '/buildings/main-buildings/edit/' + this.currentId
          : '/buildings/main-buildings/add',
      },
    ];
    this.getDropDowns();
    this.initializeForm();
    this.currentId != null
      ? this.getById()
      : this.getPickedFiles('/main-buildings/add');
  }

  initializeForm() {
    this.formData = this._formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      address: [''],
      floorsNumber: [null],
      executableProjectId: [null],
      supervisorProjectId: [null],
      siteId: [null],
      urlBuilding3D: [],
      buildingCode: [null],
      notes: [''],
      fileUploads: this._formBuilder.array([]),
    });
  }
  buildingFiles;
  getById() {
    this._mainBuildingsService
      .getBuildingById(this.currentId)
      .subscribe((res) => {
        this.mainBuildingData = res.data;
        this.uploadedFiles = res.data.fileUploads;
        this.buildingFiles = res.data.fileUploads;
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
        this.buildingFiles.forEach((e) => {
          e.id = null;
        });
        this.selectedPoint =
          'lat : ' + String(res.data.lat) + ', lng : ' + String(res.data.long);
        this.markerPositions = {
          lat: res.data.lat,
          lng: res.data.long,
        };
        this.getPickedFiles(`/main-buildings/edit/${this.currentId}`);
        for (let index = 0; index < res.data.fileUploads.length; index++) {
          const element = res.data.fileUploads[index];
          this.filesArr.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }
        this.patchData(this.mainBuildingData);
      });
  }
  patchData(val) {
    this.locationDetails = {
      address: val.location,
      latitude: val.lat,
      longitude: val.long,
    };
    this.formData.patchValue(val);
  }
  getPickedFiles(pickedPath) {
    this._fileService.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        (e.isPicked = true), (e.progress = 100);
      });
      if (this.isEdit) {
        this.uploadedFiles = [...res.data, ...this.buildingFiles];
      } else {
        this.uploadedFiles = [...res.data];
      }
    });
  }

  getDropDowns() {
    this._sharedService.getMaintenanceConsultingProjects().subscribe((res) => {
      this.consultingList = res['data'];
    });
    this._sharedService.getMaintenanceExecutiveProjects().subscribe((res) => {
      this.executiveList = res['data'];
    });
    this.getSitesLookup();
  }

  // Get Sites Lookup
  getSitesLookup() {
    this._sharedService.GetSites().subscribe((res) => {
      this.sitesList = res['data'];
    });
  }
  locationDetails;
  addMarker(event: google.maps.MapMouseEvent) {
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: event.latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.locationDetails = {
            address: results[0].formatted_address,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          };
        } else {
        }
      } else {
      }
    });

    this.markerPositions = event.latLng!.toJSON();
    this.selectedPoint =
      'lat : ' +
      String(this.markerPositions.lat) +
      ', lng : ' +
      String(this.markerPositions.lng);
    return (this.markerPositions = event.latLng!.toJSON());
  }

  submit() {
    let obj = {
      ...this.formData.value,
      lat: this.markerPositions?.lat ? this.markerPositions.lat : null,
      long: this.markerPositions?.lng ? this.markerPositions.lng : null,
      fileUploads: this.uploadedFiles,
      location: this.locationDetails?.address,
    };
    // update
    if (this.isEdit) {
      this._mainBuildingsService.editBuilding(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم تعديل تفاصيل المبنى  بنجاح، يمكنك المتابعة';
        } else {
          this.alertErrorMsg = res.errors[0].message;
          this.alertError = true;
        }
      });
    }
    // add
    else {
      this._mainBuildingsService.addBuilding(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم إضافة المبنى  بنجاح، يمكنك المتابعة';
        } else {
          this.alertErrorMsg = res.errors[0].message;
          this.alertError = true;
        }
      });
    }
  }
  cancel() {
    this.alertWarning = true
    // this._router.navigate(['/buildings/main-buildings']);
  }

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/buildings/main-buildings']);
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/buildings/main-buildings']);
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
