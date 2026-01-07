import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FileSelectEvent } from 'primeng/fileupload';
import { forkJoin } from 'rxjs';
import { ProjectsService } from 'src/app/features/main-page/projects/components/projects-menu/components/services/projects.service';
import { AttachementTypesEnum } from 'src/app/Shared/enums/attachTypesEnum';
import { ProjectTabsEnum } from 'src/app/Shared/enums/projectTabsEnum';
import { FilesService } from 'src/app/Shared/services/files.service';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { File } from 'src/app/Shared/models/files';
import * as saveAs from 'file-saver';
import { MaintenanceContractsService } from '../services/maintenance-contracts.service';
import { ContractsTabsEnum } from 'src/app/Shared/enums/contractsTabsEnum';
@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent {
  //--dropdowns
  projectTypeList;
  projectOrginList;
  projectClassificationList;
  projectStatusList;
  officeList;
  projectManagerList;
  supervisorProjectList;
  showSupervisor: boolean = false;
  showSupervisorOnNature: boolean = false;

  // ---------------
  //--Tabs flags
  projectDeets: boolean = true;
  secondaryDeets: boolean = false;
  // locationDeets: boolean = false;
  contractDeets: boolean = false;
  contractTabsEnum = ContractsTabsEnum;

  activeTab: number = this.contractTabsEnum.contractDeets;
  // ---------------
  //--Map Variables
  hybrid = google.maps.MapTypeId.HYBRID;
  center: google.maps.LatLngLiteral = {
    lat: 21.4225,
    lng: 39.8262,
  };
  zoom = 14;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  markerPositions: google.maps.LatLngLiteral;
  selectedPoint: string = '';

  // ---------------

  //--Form
  projectDetailsForm: FormGroup;
  secondaryDetailsForm: FormGroup;
  // ---------------

  currentId;
  isEdit: boolean = false;
  uploadedFiles;
  attachementTypesEnum = AttachementTypesEnum;
  percentageValue: number = 0;

  // --alerts
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
  alertConfirm: boolean = false;
  // ---------------

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder,
    private _maintenanceContractsService: MaintenanceContractsService,
    private _filesServices: FilesService
  ) {
    this._activatedRoute.params.subscribe((params) => {
      this.currentId = params['id'];
      this.currentId != null ? (this.isEdit = true) : (this.isEdit = false);
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDropDowns();
    this.initializeForm();
    this.currentId != null
      ? this.getById()
      : this.getPickedFiles('maintenance-contracts/add');
  }
  projectData;
  getById() {
    this._maintenanceContractsService
      .getProjectById(this.currentId)
      .subscribe((res) => {
        this.projectData = res.data;
        this.markerPositions = {
          lat: this.projectData?.lat,
          lng: this.projectData?.long,
        };
        // this.supervisorProjectList.push({
        //   name: this.projectData?.supervisorProjectName,
        //   id: this.projectData?.supervisorProjectId,
        // });

        this.getAllProjectManagersByOfficeId(this.projectData.officeId);
        if (
          this.projectData.supervisorProjectId &&
          this.projectData.globalProjectTypeId
        ) {
          this.showSupervisor = true;
          this.showSupervisorOnNature = true;
        }

        this.percentageValue = 100;

        this.projectFiles = this.projectData.fileUploads;
        this.projectFiles.forEach((element) => {
          element.id = null;
        });
        this.getPickedFiles(`maintenance-contracts/edit/${this.currentId}`);
        this.filterFilesByAttachementType(this.projectData.fileUploads);
        this.filesArr = [];
        for (
          let index = 0;
          index < this.projectData.fileUploads.length;
          index++
        ) {
          const element = this.projectData.fileUploads[index];
          this.filesArr.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }
        this.patchData(this.projectData);
      });
  }

  patchData(data) {
    this.locationDetails = {
      address: data.address,
      latitude: data.lat,
      longitude: data.long,
    };
    this.projectDetailsForm.patchValue({
      ...data,
    });
    this.secondaryDetailsForm.patchValue({
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      biddingDate: data.biddingDate ? new Date(data.biddingDate) : null,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      note: data.note,
    });
    this.getOfficesByProjectType(data.projectTypeId)
    this.getAllProjectManagersByOfficeId(data.officeId)
  }

  submit() {
    let obj = {
      ...this.projectDetailsForm.value,
      ...this.secondaryDetailsForm.value,
      // lat: this.markerPositions?.lat ? this.markerPositions.lat : null,
      // long: this.markerPositions?.lng ? this.markerPositions.lng : null,
      address: this.locationDetails?.address,
      startDate: this.secondaryDetailsForm.value.startDate
        ? moment(new Date(this.secondaryDetailsForm.value.startDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      endDate: this.secondaryDetailsForm.value.endDate
        ? moment(new Date(this.secondaryDetailsForm.value.endDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      biddingDate: this.secondaryDetailsForm.value.biddingDate
        ? moment(new Date(this.secondaryDetailsForm.value.biddingDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      deliveryDate: this.secondaryDetailsForm.value.deliveryDate
        ? moment(new Date(this.secondaryDetailsForm.value.deliveryDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      fileUploads: this.filesArr ? this.filesArr : null,
      DepartmentId: null,
    };
    // update
    if (this.isEdit) {
      this._maintenanceContractsService.editProject(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم تعديل تفاصيل عقد الصيانة بنجاح، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
    // add
    else {
      this._maintenanceContractsService.addProject(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            ' تمت إضافة عقد الصيانة بنجاح إلى قائمة العقود، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
  }
  cancel() {
    this.alertWarning = true;
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

  initializeForm() {
    this.projectDetailsForm = this._formBuilder.group({
      id: [null],
      contractName: [
        ,
        [
          Validators.required,
          Validators.maxLength(400),
          ,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      contractNumber: [ ],
      projectTypeId: [ ],
      officeId: [ ],
      contractValue: [ ],
      projectManagerId: [ ],
      batchesCount: [ ],

    });
    this.secondaryDetailsForm = this._formBuilder.group({
      startDate: [null],
      endDate: [null],
      biddingDate: [null],
      deliveryDate: [null],
      note: [null],
    });
  }
  get projectDeetsFormControls() {
    return this.projectDetailsForm.controls;
  }
  nextTab() {
    this.activeTab++;

    // if (this.projectDetailsForm.valid) {
    //   this.changeTab(this.projectTabsEnum.secondaryDeets)
    // } else {
    //   this.activeTab++

    // }
  }
  changeTab(val) {
    this.activeTab = val;
  }
  officeWarningMsg: boolean = false;
  getOfficesByProjectType(event){
    this._sharedService.getOfficesByType(event).subscribe(res=>{
      this.officeList = res.data
      this.officeWarningMsg =true;
    })
  }
  getDropDowns() {
    forkJoin({
      projectTypeReq: this._sharedService.getProjectType(),
      projectClassificationReq: this._sharedService.getProjectClassifications(),
      projectStatusReq: this._sharedService.getProjectStatus(),
      OfficeReq: this._sharedService.getContractors(),
      // projectManagerReq: this._sharedService.getManagers(),
      // supervisorProjectReq: this._sharedService.getSuperVisorProjectsList(),
    }).subscribe(
      ({
        projectTypeReq,
        projectClassificationReq,
        projectStatusReq,
        OfficeReq,
        // projectManagerReq,
        // supervisorProjectReq,
      }) => {
        this.projectTypeList = projectTypeReq.data;
        this.projectClassificationList = projectClassificationReq.data;
        this.projectStatusList = projectStatusReq.data;
        // this.officeList = OfficeReq.data;
        // this.projectManagerList = projectManagerReq.data;
        // this.supervisorProjectList = supervisorProjectReq.data;
      }
    );
  }
  showSupervisorProject(value) {
    if (value.value == 2) {
      this.showSupervisor = true;
    } else {
      this.showSupervisor = false;
      this.projectDetailsForm.value.supervisorProjectId = null;
    }
  }
  chooseProjectNature(value) {
    if (value.value == 1) {
      this.showSupervisorOnNature = true;
    } else {
      this.showSupervisorOnNature = false;
      this.projectDetailsForm.value.supervisorProjectId = null;
    }
  }
  getAllProjectManagersByOfficeId(event) {
    this._sharedService
      .getProjectManagersByOfficeId(event)
      .subscribe((data) => {
        this.projectManagerList = data.data;
      });
  }

  // FILES FUNCTIONS
  SelectedFile(event: FileSelectEvent, fileUpload, attachTypeId) {
    for (let index = 0; index < event.currentFiles.length; index++) {
      let file = event.currentFiles[index];
      let FileName = file.name;
      let size = this._filesServices.getFileSize(file.size);
      let unit = this._filesServices.getFileSizeUnit(file.size);
      let fullSize;
      if (unit == 'KB') {
        fullSize = size + ' كيلو بايت';
      } else if (unit == 'MB') {
        fullSize = size + ' ميجا بايت';
      }
      this.uploadedFiles = [];
      this.uploadedFiles?.push({
        name: FileName,
        size: fullSize,
        originalName: FileName,
        attachTypeId: attachTypeId,
        progress: 0,
      });

      // this.filterFilesByAttachementType(this.uploadedFiles)
      this.changeFileIcon(this.uploadedFiles);
      let currentUplodedFileIndex = this.uploadedFiles.length - 1;
      let pageRoute = 'maintenance-contracts/add';
      if (this.isEdit) {
        pageRoute = `maintenance-contracts/edit/${this.currentId}`;
      }
      this._filesServices
        .uploadFileWithProgress(file, pageRoute, attachTypeId)
        .subscribe({
          next: (data) => {
            this.uploadedFiles[currentUplodedFileIndex].progress =
              data.progress;
            if (data.response) {
              if (
                data.response.errors?.length == 0 &&
                data.response.data?.length != 0
              ) {
                let uplodedFilesTemp = data.response.data;
                for (let index = 0; index < uplodedFilesTemp?.length; index++) {
                  const element = uplodedFilesTemp[index];
                  let fileItem = {
                    name: FileName,
                    size: fullSize,
                    fullPath: element.fullPath,
                    filePath: element.filePath,
                    attachTypeId: attachTypeId,
                    originalName: element.originalName,
                    id: element.id,
                    progress: 100,
                  };
                  this.uploadedFiles[currentUplodedFileIndex] = fileItem;
                  this.uploadedFiles.map((e) => (e.isPicked = true));
                  this.filterFilesByAttachementType(this.uploadedFiles);

                  this.filesArr.push({
                    filePath: element.filePath,
                    fullPath: element.fullPath,
                    originalName: element.originalName,
                    attachTypeId: attachTypeId,
                  });
                }
              }
            }
          },
          error: (error) => {
            console.error('Upload error:', error);
          },
        });
    }
    fileUpload.clear();
  }
  changeFileIcon(files) {
    switch (files.attachTypeId) {
      case 1:
        this.projectDeliveryFiles.map((e) => (e.isPicked = true));

        break;
      case 2:
        this.awardedProjectRecordFiles.map((e) => (e.isPicked = true));

        break;
      case 3:
        this.planFiles.map((e) => (e.isPicked = true));
        break;
      case 4:
        this.contractFiles.map((e) => (e.isPicked = true));
        break;
      default:
        break;
    }
  }

  projectFiles;

  contractFiles: File[] = [];
  planFiles: File[] = [];
  projectDeliveryFiles: File[] = [];
  awardedProjectRecordFiles: File[] = [];
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
//   remove(filePath: string, index: number, attachementTypeId, file) {
//     switch (attachementTypeId) {
//       case 1:
//         this.projectDeliveryFiles.splice(index, 1);
//         break;
//       case 2:
//         this.awardedProjectRecordFiles.splice(index, 1);
//         break;
//       case 3:
//         this.planFiles.splice(index, 1);
//         break;
//       case 4:
//         this.contractFiles.splice(index, 1);
//         break;
//       default:
//         break;
//     }

//     this.filesArr.splice(index, 1);

//     if (file.isPicked == true) {
//       this._filesServices.deleteFile(filePath).subscribe((data) => {});
//     }
//   }






// remove(filePath: string,index:number, attachementTypeId: number, file) {
//   // Loop through the filesArr to find and remove the file with the matching attachment type ID
//   for (let i = 0; i < this.filesArr.length; i++) {
//     const currentFile = this.filesArr[i];

//     // Check if the attachment type ID matches and remove it from the corresponding array
//     if (currentFile.attachTypeId === attachementTypeId) {
//       // Remove from the relevant array based on the attachmentTypeId
//       switch (attachementTypeId) {
//         case 1:
//           this.projectDeliveryFiles.splice(i, 1);
//           break;
//         case 2:
//           this.awardedProjectRecordFiles.splice(i, 1);
//           break;
//         case 3:
//           this.planFiles.splice(i, 1);
//           break;
//         case 4:
//           this.contractFiles.splice(i, 1);
//           break;
//         default:
//           break;
//       }

//       // Now remove the file from filesArr by its index
//       this.filesArr.splice(i, 1);  // Remove the item at the selected index


//       // If the file is marked as 'picked', delete it from the server
//       if (file.isPicked === true) {
//         this._filesServices.deleteFile(filePath).subscribe((data) => {
//           // Handle post-deletion logic if necessary
//         });
//       }

//       // Break the loop after removing the file
//       break;
//     }
//   }
// }

remove(filePath: string, attachementTypeId: number, file) {
  // Find the file in filesArr using filePath
  const fileIndexInFilesArr = this.filesArr.findIndex(f => f.filePath === filePath);

  if (fileIndexInFilesArr !== -1) {
    const fileToRemove = this.filesArr[fileIndexInFilesArr];

    // Remove the file from the correct list based on attachementTypeId
    switch (attachementTypeId) {
      case 1:
        // Find the file in the projectDeliveryFiles list and remove it
        const projectIndex = this.projectDeliveryFiles.findIndex(f => f.filePath === filePath);
        if (projectIndex !== -1) {
          this.projectDeliveryFiles.splice(projectIndex, 1);
        }
        break;
      case 2:
        // Find the file in the awardedProjectRecordFiles list and remove it
        const awardedIndex = this.awardedProjectRecordFiles.findIndex(f => f.filePath === filePath);
        if (awardedIndex !== -1) {
          this.awardedProjectRecordFiles.splice(awardedIndex, 1);
        }
        break;
      case 3:
        // Find the file in the planFiles list and remove it
        const planIndex = this.planFiles.findIndex(f => f.filePath === filePath);
        if (planIndex !== -1) {
          this.planFiles.splice(planIndex, 1);
        }
        break;
      case 4:
        // Find the file in the contractFiles list and remove it
        const contractIndex = this.contractFiles.findIndex(f => f.filePath === filePath);
        if (contractIndex !== -1) {
          this.contractFiles.splice(contractIndex, 1);
        }
        break;
      default:
        break;
    }

    // Now remove the file from filesArr by its index
    this.filesArr.splice(fileIndexInFilesArr, 1);  // Remove the item from filesArr


    // If the file is marked as 'picked', delete it from the server
    if (file.isPicked === true) {
      this._filesServices.deleteFile(filePath).subscribe((data) => {
        // Handle post-deletion logic if necessary
      });
    }
  } else {
    console.error('File to remove not found in filesArr!');
  }
}









  getPickedFiles(pickedPath) {
    this._filesServices.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
      });
      if (this.isEdit) {
        this.filesArr = [...res.data, ...this.projectFiles];
      } else {
        this.filesArr = [...res.data];
      }
      this.filterFilesByAttachementType(res.data);
      res.data.forEach((element) => {
        element.id = null;
      });
    });
  }
  fileOnProgress(event) {
    // this.fileUpload.progress = event;
  }
  downloadFile(data) {

    // saveAs(`${data.fullPath}`, `${data.originalName}`);
    window.open(`${data.fullPath}`, '_blank');
  }

  filterFilesByAttachementType(files) {
    files.forEach((file) => {
      switch (file.attachTypeId) {
        case 1:
          this.projectDeliveryFiles.push(file);

          this.projectDeliveryFiles.forEach((e) => {
            e.progress = 100;
          });

          break;
        case 2:

          this.awardedProjectRecordFiles.push(file);

          this.awardedProjectRecordFiles.forEach((e) => {
            e.progress = 100;
          });
          break;
        case 3:
          this.planFiles.push(file);

          this.planFiles.forEach((e) => {
            e.progress = 100;
          });
          break;
        case 4:
          this.contractFiles.push(file);

          this.contractFiles.forEach((e) => {
            e.progress = 100;
          });

          break;
        default:
          break;
      }
    });
  }

  // END OF FILES FUNCTIONS

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/maintenance/maintenance-contracts']);
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/maintenance/maintenance-contracts']);
    } else {
      this.alertWarning = false;
    }
  }

  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

  checkValidity() {
    return this.projectDetailsForm.valid;
  }
  onlyNumberAndComma(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const cursorPos = input.selectionStart || 0;

    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    if (allowedKeys.includes(event.key)) return;

    const isNumber = /[0-9]/.test(event.key);
    const isComma = event.key === ',';

    // Block anything not a digit or comma
    if (!isNumber && !isComma) {
      event.preventDefault();
      return;
    }

    const beforeCursor = value.substring(0, cursorPos);
    const afterCursor = value.substring(cursorPos);

    // Block if comma is next to another comma
    if (
      isComma &&
      (beforeCursor.endsWith(',') || afterCursor.startsWith(','))
    ) {
      event.preventDefault();
    }
  }


}
