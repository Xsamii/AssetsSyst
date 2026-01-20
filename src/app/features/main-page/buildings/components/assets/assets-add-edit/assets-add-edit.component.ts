import { filter } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { AssetsService } from '../assets.service';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { CommonModule } from '@angular/common';
import { File, UploadFiles } from 'src/app/Shared/models/files';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { FilesService } from 'src/app/Shared/services/files.service';

@Component({
  selector: 'app-assets-add-edit',
  templateUrl: './assets-add-edit.component.html',
  styleUrls: ['./assets-add-edit.component.scss'],
  standalone: true,
  imports: [
    BreadCrumbComponent,
    DropdownModule,
    UploadFileComponent,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    CommonModule,
    MultiSelectModule,
    CalendarModule,
  ],
})
export class AssetsAddEditComponent implements OnInit, OnDestroy {
  sitesList
  mainBuildingsList;
  FloorsList;
  officesList;
  typeAssetList;
  assetStatusList;
  regularmaintenanceitemList;
  categoryList;
  subCategoryList;
  assetbyID;
  assetForm: FormGroup;
  uploadedFiles: File[] = [];
  editeId!: number;
  editMode: boolean = false;
  subTitle: any[];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
  filterDataParams = new FilterDataParams();

  // Enhanced MultiSelect properties
  enhancedMaintenanceList: any[] = [];
  currentSearchTerm: string = '';
  filterTimeout: any;

  @ViewChild('maintenanceDropdown') maintenanceDropdown!: Dropdown;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _assetService: AssetsService,
    private _sharedService: SharedService,
    private _fileService: FilesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getBulldingLookUp();
    this.getSitesLookUp();
    this.getAssetTypeLookUp();
    this.getRegularMaintenanceItemList();
    this.assetStatusList = [
      {
        status: true,
        name: 'يعمل',
      },
      {
        status: false,
        name: ' لا يعمل',
      },
    ];
    if (this._router.url == '/buildings/assets/add') {
      this.editMode = false;
      this.subTitle = [
        { name: 'الرئيسية', routerLink: '/' },
        { name: 'إدارة الأصول', routerLink: '/buildings/assets' },
        { name: ' إضافة اصل', routerLink: '/buildings/assets/add' },
      ];
      this.getPickedFiles('/assets/add');
    } else {
      this.editeId = Number(this._route.snapshot.paramMap.get('id'));
      this.getDataById(this.editeId);
      this.editMode = true;
      this.subTitle = [
        { name: 'الرئيسية', routerLink: '/' },
        { name: 'إدارة الأصول', routerLink: '/buildings/assets' },
        { name: ' تعديل اصل', routerLink: `/buildings/assets/edit/${this.editeId}` },
      ];
    }
  }

  ngOnDestroy(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
  }

  initializeForm() {
    this.assetForm = this._formBuilder.group({
      id:[null],
      assetNumber: [null, Validators.required],
      manufacturerNume: ["", ],
      catalogUrl: [null,],
      serialNumber: [""],
      job: [null],
      industryDate: [null],
      warrantyDuration: [0],
      agentName: [null],
      isWorking: [null],
      regularMaintenanceDays: [0],
      secondaryMaintenanceDays: [0],
      notes: [null],
      assetTypeId: [null, Validators.required],
      categoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      officeId: [null, Validators.required],
      regularMaintenanceItemIds: [[]],
      fileUploads: [null],
      siteId: [null, Validators.required],
      buildingId: [null, Validators.required],
      FloorId: [null, Validators.required],
    });
  }

  // ------------------------------------
  // Helper methods to get names instead of IDs
  // ------------------------------------

  getSelectedBuildingName(): string {
    const buildingId = this.assetForm.get('buildingId')?.value;
    const building = this.mainBuildingsList?.find((b) => b.id === buildingId);
    return building?.code || '';
  }


  getSelectedFloorName(): string {
    const floorId = this.assetForm.get('FloorId')?.value;
    const floor = this.FloorsList?.find((f) => f.id === floorId);
    return floor?.code || '';
  }

  getSelectedOfficeName(): string {
    const officeId = this.assetForm.get('officeId')?.value;
    const office = this.officesList?.find((o) => o.id === officeId);
    return office?.code || '';
  }

  getSelectedAssetTypeName(): string {
    const assetTypeId = this.assetForm.get('assetTypeId')?.value;
    const assetType = this.typeAssetList?.find((a) => a.id === assetTypeId);
    return assetType?.code || '';
  }

  getAssetDisplayName(): string {
    const parts = [
      this.getSelectedBuildingName(),
      this.getSelectedFloorName(),
      this.getSelectedOfficeName(),
      this.getSelectedAssetTypeName(),
      this.assetForm.get('assetNumber')?.value,
    ].filter((part) => part && part.toString().trim() !== '');

    return parts.join(' - ');
  }

  // ------------------------------------
  // LookUps
  // ------------------------------------
  getSitesLookUp(){
    this._sharedService.GetSites().subscribe((res) => {
      this.sitesList = res.data;
    });
  }
  getBulldingLookUp() {
    // this._sharedService.getAllBuilding().subscribe((res) => {
    //   this.mainBuildingsList = res.data;
    // });
  }
  changeSites(value) {
    this.getSiteBuildings(value.value);
  }
  getSiteBuildings(id) {
    this._sharedService.GetBuildingsBySiteId(id).subscribe((res) => {
      this.mainBuildingsList = res.data;
    });
  }

  changeBulding(value) {
    this.getFloorLookUp(value.value);
  }






  getFloorLookUp(id) {
    this._sharedService.GetBuildingFloors(id).subscribe((res) => {
      this.FloorsList = res.data;
    });
  }

  changeFloor(id) {
    this.getOfficesInFloorUp(id.value);
  }

  getOfficesInFloorUp(id) {
    this._sharedService.getOfficesInFloor(id).subscribe((res) => {
      this.officesList = res.data;
    });
  }

  getAssetTypeLookUp() {
    this._sharedService.getAllAssetTypes().subscribe((res) => {
      this.typeAssetList = res.data;
    });
  }

  changeAssetType(value) {
    this.getAllAssetTypesMainCategories(value.value);
  }

  getAllAssetTypesMainCategories(id) {
    this._sharedService.getAllAssetTypesMainCategories(id).subscribe((res) => {
      this.categoryList = res.data;
    });
  }

  changeAssetTypesMainCategories(id) {
    this.getAllAssetTypesSubCategories(id.value);
  }

  getAllAssetTypesSubCategories(id) {
    this._sharedService.getAllAssetTypesSubCategories(id).subscribe((res) => {
      this.subCategoryList = res.data;
    });
  }

  // ------------------------------------
  // Enhanced Maintenance Items Methods
  // ------------------------------------

  getRegularMaintenanceItemList(searchTerm?: string, paganations?: any) {
    this.filterDataParams.searchTerm = searchTerm;
    this.currentSearchTerm = searchTerm || '';

    this._assetService
      .getRegularMaintenanceItemList(paganations, this.filterDataParams)
      .subscribe((data) => {
        this.regularmaintenanceitemList = data.data.items;


        // Create enhanced list with add button when needed
        this.createEnhancedMaintenanceList();
      });
  }

  createEnhancedMaintenanceList() {
    // Start with regular items
    this.enhancedMaintenanceList = [...this.regularmaintenanceitemList];

    // Add "Add new item" option if there's a search term and no exact match
    if (this.currentSearchTerm && this.currentSearchTerm.trim() !== '') {
      const exactMatch = this.regularmaintenanceitemList.find(
        (item) =>
          item.name.toLowerCase().trim() ===
          this.currentSearchTerm.toLowerCase().trim()
      );

      // Show add button if no exact match found
      if (!exactMatch) {
        this.enhancedMaintenanceList.push({
          id: 'add-new-item',
          name: `إضافة: "${this.currentSearchTerm}"`,
          isAddButton: true,
          searchTerm: this.currentSearchTerm,
        });
      }
    }
  }

  onDropdownFilter(event: any) {
    // Update current search term
    this.currentSearchTerm = event.filter || '';

    // Add a small delay to ensure the filter has been processed
    setTimeout(() => {
      this.getRegularMaintenanceItemList(this.currentSearchTerm);
    }, 100);

  }

  // Alternative method to handle real-time filtering
  onFilterChange(event: any) {

    const searchTerm = event.target?.value || '';
    this.currentSearchTerm = searchTerm;

    // Debounce the API call
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.getRegularMaintenanceItemList(searchTerm);
    }, 300);
  }

  // New method to handle adding from inside dropdown
  addNewMaintenanceItem(searchTerm: string, event: Event) {
    // Prevent the dropdown from selecting this item
    event.stopPropagation();
    event.preventDefault();

    if (!searchTerm || searchTerm.trim() === '') {
      console.warn('Search term is empty');
      return;
    }

    const body = {
      name: searchTerm.trim(),
    };

    this._assetService.addRegularMaintenanceItem(body).subscribe(
      (res) => {
        if (res.data) {
          // Refresh the list
          this.getRegularMaintenanceItemList();

          // Clear the filter
          if (this.maintenanceDropdown) {
            this.maintenanceDropdown.resetFilter();
          }
          this.currentSearchTerm = '';

          // Optional: Auto-select the newly created item
          const currentValues =
            this.assetForm.get('regularMaintenanceItemIds')?.value || [];
          const newValues = [...currentValues, res.data.id];
          this.assetForm.patchValue({
            regularMaintenanceItemIds: newValues,
          });

        }
      },
      (error) => {
        console.error('Error adding maintenance item:', error);
      }
    );
  }

  // ------------------------------------
  // Asset CRUD Methods
  // ------------------------------------

  getDataById(id) {
    this._assetService.getAssetById(id).subscribe((res) => {
      this.assetbyID = res.data;
      if (res.isSuccess) {
        this.getPickedFiles(`/assets/edit/${id}`);
        for (let index = 0; index < res.data.fileUploads.length; index++) {
          const element = res.data.fileUploads[index];
          this.uploadedFiles.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });

        this.patchAssetForm(this.assetbyID);
      }
    });
  }

  patchAssetForm(data) {

     if (data.site.id) {
      this.getSiteBuildings(data.site.id);
    }
    if (data.building.id) {
      this.getFloorLookUp(data.building.id);
    }
    if (data.floor.id) {
      this.getOfficesInFloorUp(data.floor.id);
    }
    if (data.assetType.id) {
      this.getAllAssetTypesMainCategories(data.assetType.id);
    }
    if (data.category.id) {
      this.getAllAssetTypesSubCategories(data.category.id);
    }
    this.assetForm.patchValue({
      id:data.id,
      assetNumber: data.assetNumber,
      manufacturerNume: data.manufacturerNume,
      catalogUrl: data.catalogUrl,
      serialNumber: data.serialNumber,
      job: data.job,
      industryDate: data.industryDate? new Date(data.industryDate) : null,
      warrantyDuration: data.warrantyDuration,
      agentName: data.agentName,
      regularMaintenanceDays: data.regularMaintenanceDays,
      secondaryMaintenanceDays: data.secondaryMaintenanceDays,
      notes: data.notes,
      assetTypeId: data.assetType.id,
      categoryId: data.category.id,
      subCategoryId: data.subCategory.id,
      officeId: data.office.id,
      regularMaintenanceItemIds:  data.regularMaintenanceItems?.map(item => item.id) || [],
      siteId: data.site?.id,
      buildingId: data.building?.id,
      FloorId: data.floor.id,
      isWorking: data.isWorking,
    });


  }

  createUpdateAsset() {
    this.assetForm.patchValue({
      fileUploads: this.uploadedFiles,
    });

    if (this.editMode) {
      this._assetService.editAsset(this.assetForm.value).subscribe(
        (res) => {
          if (res['isSuccess']) {
            this.alertSuccess = true;
            this.alertError = false;
            this.alertSuccessMsg =
              'تمت تعديل طلب  الاصول بنجاح إلى قائمة الاصول، يمكنك المتابعة';
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
      this._assetService.addAsset(this.assetForm.value).subscribe(
        (res) => {
          if (res['isSuccess']) {
            this.alertSuccess = true;
            this.alertError = false;
            this.assetForm.reset();

            this.alertSuccessMsg =
              'تمت اضافة  طلب  الاصول بنجاح إلى قائمة  الاصول  يمكنك المتابعة';
          } else {
            this.alertErrorMsg =
              res['errors'][0].message ||
              'حدث خطأ: بعض الحقول مطلوبة، يرجى إدخال البيانات الناقصة.';
            this.alertError = true;
          }
        },
        (error) => {
          this.alertSuccess = false;
          this.alertError = true;
          this.alertErrorMsg =
            'حدث خطأ: بعض الحقول مطلوبة، يرجى إدخال البيانات الناقصة.';
        }
      );
    }
  }

  routeToAssets() {
    this.initializeForm();
    this._router.navigate(['/buildings/assets']);
  }

  // ------------------------------------
  // ALERTS FUNCTIONS
  // ------------------------------------
  onCancle() {
    this.alertWarning = true;
  }

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/buildings/assets']);
    }
  }

  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/buildings/assets']);
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
        this.uploadedFiles = [...res.data, ...this.uploadedFiles];
      } else {
        this.uploadedFiles = [...res.data];
      }
    });
  }
}
