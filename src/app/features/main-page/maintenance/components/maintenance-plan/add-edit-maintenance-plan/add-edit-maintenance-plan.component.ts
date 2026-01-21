import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { MaintenancePlanService } from '../services/maintenance-plan.service';

@Component({
  selector: 'app-add-edit-maintenance-plan',
  templateUrl: './add-edit-maintenance-plan.component.html',
  styleUrls: ['./add-edit-maintenance-plan.component.scss'],
})
export class AddEditMaintenancePlanComponent implements OnInit {
  maintenancePlanForm: FormGroup;

  // Lookup arrays
  maintenanceTypsLookup: any[] = [];
  mainBuildingsList: any[] = [];
  floorsList: any[] = [];
  officeList: any[] = [];
  assetsList: any[] = [];
  planMalfunctionTypesList: any[] = [];

  // Component state
  editMode: boolean = false;
  id: number;
  isLoading: boolean = false;

  // Alert states
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _maintenancePlanService: MaintenancePlanService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initMaintenancePlanForm();
    this.loadLookupData();
    this.checkEditMode();
  }

  // Initialize form
  initMaintenancePlanForm() {
    this.maintenancePlanForm = this.fb.group({
      maintenanceTypeId: [2, Validators.required],
      buildingId: [null, Validators.required],
      floorIds: [[]],
      assetIds: [[]],
      officeId: [null, Validators.required],
      planMalfunctionTypeIds: [[], Validators.required],
      planDay: [null],
      dateFrom: [null],
      dateTo: [null],
    });

    this.setupFormSubscriptions();
  }

  // Setup form subscriptions for cascading dropdowns
  setupFormSubscriptions() {
    // When maintenance type changes, update form validation and structure
    this.maintenancePlanForm.get('maintenanceTypeId')?.valueChanges.subscribe(typeId => {
      this.updateFormValidationBasedOnType(typeId);
    });

    // When building changes, load floors and assets
    this.maintenancePlanForm.get('buildingId')?.valueChanges.subscribe(buildingId => {
      if (buildingId) {
        // Clear floors and assets lists first
        this.floorsList = [];
        this.assetsList = [];

        // Clear form selections
        this.maintenancePlanForm.patchValue({
          floorIds: [],
          assetIds: []
        }, { emitEvent: false });

        // Load new data
        this.loadFloorsForBuilding(buildingId);
        this.loadAssetsByBuilding(buildingId);
      } else {
        this.floorsList = [];
        this.assetsList = [];
        this.maintenancePlanForm.patchValue({
          floorIds: [],
          assetIds: []
        }, { emitEvent: false });
      }
    });

    // When floor selection changes, load assets by floor IDs
    this.maintenancePlanForm.get('floorIds')?.valueChanges.subscribe(floorIds => {
      if (floorIds && floorIds.length > 0) {
        // Clear assets list first
        this.assetsList = [];

        // Clear asset selections
        this.maintenancePlanForm.patchValue({
          assetIds: []
        }, { emitEvent: false });

        // Load assets filtered by floors
        this.loadAssetsByFloorIds(floorIds);
      } else if (this.maintenancePlanForm.get('buildingId')?.value) {
        // If no floors selected but building is selected, load all assets by building
        this.assetsList = [];
        this.maintenancePlanForm.patchValue({
          assetIds: []
        }, { emitEvent: false });
        this.loadAssetsByBuilding(this.maintenancePlanForm.get('buildingId')?.value);
      }
    });
  }

  // Load floors for selected building
  loadFloorsForBuilding(buildingId: number) {
    if (!buildingId) {
      this.floorsList = [];
      return;
    }

    this._sharedService.GetBuildingFloors(buildingId).subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.floorsList = response.data;
        }
      },
      (error) => {
        console.error('Error loading floors for building:', error);
        this.showError('خطأ في تحميل قائمة الطوابق');
      }
    );
  }

  // Load assets by building ID
  loadAssetsByBuilding(buildingId: number) {
    if (!buildingId) {
      this.assetsList = [];
      return;
    }

    this._sharedService.getAllAssetsByBuildingId(buildingId).subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.assetsList = response.data;
        }
      },
      (error) => {
        console.error('Error loading assets for building:', error);
        this.showError('خطأ في تحميل قائمة الأصول');
      }
    );
  }

  // Load assets by floor IDs
  loadAssetsByFloorIds(floorIds: number[]) {
    if (!floorIds || floorIds.length === 0) {
      this.assetsList = [];
      return;
    }

    this._sharedService.getAllAssetsByFloorIds(floorIds).subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.assetsList = response.data;
        }
      },
      (error) => {
        console.error('Error loading assets for floors:', error);
        this.showError('خطأ في تحميل قائمة الأصول');
      }
    );
  }

  // Check if building is selected
  get hasSelectedBuilding(): boolean {
    return !!this.maintenancePlanForm.get('buildingId')?.value;
  }

  // Update form validation based on maintenance type
  updateFormValidationBasedOnType(typeId: number) {
    const planDayControl = this.maintenancePlanForm.get('planDay');
    const dateFromControl = this.maintenancePlanForm.get('dateFrom');
    const dateToControl = this.maintenancePlanForm.get('dateTo');

    // Clear all validators first
    planDayControl?.clearValidators();
    dateFromControl?.clearValidators();
    dateToControl?.clearValidators();

    // Clear values when switching types
    planDayControl?.setValue(null);
    dateFromControl?.setValue(null);
    dateToControl?.setValue(null);

    // Get the selected maintenance type name for comparison
    const selectedType = this.maintenanceTypsLookup.find(type => type.id === typeId);
    const typeName = selectedType?.name;

    if (typeName === 'وقائي') {
      // For preventive maintenance: require single day
      planDayControl?.setValidators([Validators.required]);
    } else if (typeName === 'دوري') {
      // For periodic maintenance: require date range
      dateFromControl?.setValidators([Validators.required]);
      dateToControl?.setValidators([Validators.required]);
    }

    // Update validity
    planDayControl?.updateValueAndValidity();
    dateFromControl?.updateValueAndValidity();
    dateToControl?.updateValueAndValidity();
  }

  // Check if current maintenance type is وقائي (preventive)
  get isPreventiveMaintenance(): boolean {
    const typeId = this.maintenancePlanForm.get('maintenanceTypeId')?.value;
    const selectedType = this.maintenanceTypsLookup.find(type => type.id === typeId);
    return selectedType?.name === 'وقائي';
  }

  // Check if current maintenance type is دوري (periodic)
  get isPeriodicMaintenance(): boolean {
    const typeId = this.maintenancePlanForm.get('maintenanceTypeId')?.value;
    const selectedType = this.maintenanceTypsLookup.find(type => type.id === typeId);
    return selectedType?.name === 'دوري';
  }

  // Check if current maintenance type is وقائي (preventive) or no type selected
  get isPreventiveOrNoType(): boolean {
    const typeId = this.maintenancePlanForm.get('maintenanceTypeId')?.value;
    if (!typeId) return true;
    const selectedType = this.maintenanceTypsLookup.find(type => type.id === typeId);
    return selectedType?.name === 'وقائي';
  }

  // Check if maintenance type is selected
  get isMaintenanceTypeSelected(): boolean {
    return !!this.maintenancePlanForm.get('maintenanceTypeId')?.value;
  }

  // Getter for easy access to form controls
  get formControls() {
    return {
      maintenanceTypeId: this.maintenancePlanForm.get('maintenanceTypeId')!,
      buildingId: this.maintenancePlanForm.get('buildingId')!,
      floorIds: this.maintenancePlanForm.get('floorIds')!,
      officeId: this.maintenancePlanForm.get('officeId')!,
      planMalfunctionTypeIds: this.maintenancePlanForm.get('planMalfunctionTypeIds')!,
      planDay: this.maintenancePlanForm.get('planDay')!,
      dateFrom: this.maintenancePlanForm.get('dateFrom')!,
      dateTo: this.maintenancePlanForm.get('dateTo')!
    };
  }

  // Check if in edit mode
  checkEditMode() {
    if (this._router.url.includes('/add')) {
      this.editMode = false;
    } else if (this._router.url.includes('/edit')) {
      this.editMode = true;
      this._activatedRoute.params.subscribe((params) => {
        this.id = params['id'];
        if (this.id) {
          this.loadMaintenancePlanData();
        }
      });
    }
  }

  // Load lookup data
  loadLookupData() {
    this.loadMaintenanceTypes();
    this.loadMainBuildings();
    this.loadOffices();
    this.loadPlanMalfunctionTypes();
  }

  // Load maintenance types
  loadMaintenanceTypes() {
    this._sharedService.getRegularCheckTypes().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.maintenanceTypsLookup = response.data;
        }
      },
      (error) => {
        console.error('Error loading maintenance types:', error);
      }
    );
  }

  // Load main buildings
  loadMainBuildings() {
    this._sharedService.getAllBuilding().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.mainBuildingsList = response.data;
        }
      },
      (error) => {
        console.error('Error loading buildings:', error);
        this.showError('خطأ في تحميل قائمة المباني');
      }
    );
  }

  // Load offices/contractors
  loadOffices() {
    this._sharedService.getOfficeList().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.officeList = response.data;
        }
      },
      (error) => {
        console.error('Error loading offices:', error);
        this.showError('خطأ في تحميل قائمة المقاولين');
      }
    );
  }

  // Load plan malfunction types
  loadPlanMalfunctionTypes() {
    this._sharedService.GetPlanMalfunctionTypeId().subscribe(
      (response: any) => {
        if (response.isSuccess && response.data) {
          this.planMalfunctionTypesList = response.data;
        }
      },
      (error) => {
        console.error('Error loading plan malfunction types:', error);
        this.showError('خطأ في تحميل قائمة أنواع الأعطال');
      }
    );
  }

  // Load maintenance plan data for editing
  loadMaintenancePlanData() {
    this.isLoading = true;
    this._maintenancePlanService.getMaintenancePlanById(this.id).subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          const data = response.data;
          this.loadDependentDataAndPatchForm(data);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading maintenance plan:', error);
        this.showError('خطأ في تحميل بيانات خطة الصيانة');
        this.isLoading = false;
      }
    );
  }

  // Load dependent data and patch form
  async loadDependentDataAndPatchForm(data: any) {
    try {
      // Convert single planMalfunctionTypeId to array for multiselect
      const planMalfunctionTypeIds = Array.isArray(data.planMalfunctionTypeIds)
        ? data.planMalfunctionTypeIds
        : data.planMalfunctionTypeId ? [data.planMalfunctionTypeId] : [];

      // First, patch the independent fields
      this.maintenancePlanForm.patchValue({
        maintenanceTypeId: data.maintenanceTypeId,
        buildingId: data.buildingId,
        officeId: data.officeId,
        planMalfunctionTypeIds: planMalfunctionTypeIds,
        planDay: data.planDay ? new Date(data.planDay) : null,
        dateFrom: data.dateFrom ? new Date(data.dateFrom) : null,
        dateTo: data.dateTo ? new Date(data.dateTo) : null
      });

      // Load floors if building is selected
      if (data.buildingId) {
        await this.loadFloorsAsync(data.buildingId);

        // Convert single values to arrays for multiselect
        const floorIds = Array.isArray(data.floorIds)
          ? data.floorIds
          : data.floorId ? [data.floorId] : [];

        // Patch floors after loading
        this.maintenancePlanForm.patchValue({
          floorIds: floorIds
        });

        // Load assets based on what's selected
        if (floorIds.length > 0) {
          // If floors are selected, load assets by floor IDs
          await this.loadAssetsByFloorIdsAsync(floorIds);
        } else {
          // Otherwise, load assets by building ID
          await this.loadAssetsByBuildingAsync(data.buildingId);
        }

        // Convert single values to arrays for multiselect
        const assetIds = Array.isArray(data.assetIds)
          ? data.assetIds
          : data.assetId ? [data.assetId] : [];

        // Patch assets after loading
        this.maintenancePlanForm.patchValue({
          assetIds: assetIds
        });
      }
    } catch (error) {
      console.error('Error loading dependent data:', error);
      this.showError('خطأ في تحميل البيانات المترابطة');
    }
  }

  // Async version of loadFloorsForBuilding
  private loadFloorsAsync(buildingId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._sharedService.GetBuildingFloors(buildingId).subscribe(
        (response) => {
          if (response.isSuccess && response.data) {
            this.floorsList = response.data;
            resolve();
          } else {
            reject('Failed to load floors');
          }
        },
        (error) => {
          console.error('Error loading floors:', error);
          reject(error);
        }
      );
    });
  }

  // Async version of loadAssetsByBuilding
  private loadAssetsByBuildingAsync(buildingId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._sharedService.getAllAssetsByBuildingId(buildingId).subscribe(
        (response) => {
          if (response.isSuccess && response.data) {
            this.assetsList = response.data;
            resolve();
          } else {
            reject('Failed to load assets');
          }
        },
        (error) => {
          console.error('Error loading assets:', error);
          reject(error);
        }
      );
    });
  }

  // Async version of loadAssetsByFloorIds
  private loadAssetsByFloorIdsAsync(floorIds: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this._sharedService.getAllAssetsByFloorIds(floorIds).subscribe(
        (response) => {
          if (response.isSuccess && response.data) {
            this.assetsList = response.data;
            resolve();
          } else {
            reject('Failed to load assets');
          }
        },
        (error) => {
          console.error('Error loading assets:', error);
          reject(error);
        }
      );
    });
  }

  // Submit form
  onSubmit() {
    if (this.maintenancePlanForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    if (this.editMode) {
      this.updateMaintenancePlan(formData);
    } else {
      this.createMaintenancePlan(formData);
    }
  }

  // Date formatting helper method
  private formatDateWithoutTimezone(date: Date): string {
    if (!date) return new Date().toISOString();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  // Prepare form data for submission
  prepareFormData() {
    const formValue = this.maintenancePlanForm.value;

    const data: any = {
      maintenanceTypeId: Number(formValue.maintenanceTypeId),
      buildingId: Number(formValue.buildingId),
      floorIds: formValue.floorIds?.length > 0
        ? formValue.floorIds.map((id: any) => Number(id))
        : [],
      assetIds: formValue.assetIds?.length > 0
        ? formValue.assetIds.map((id: any) => Number(id))
        : [],
      officeId: formValue.officeId ? Number(formValue.officeId) : 0,
      planMalfunctionTypeIds: formValue.planMalfunctionTypeIds?.length > 0
        ? formValue.planMalfunctionTypeIds.map((id: any) => Number(id))
        : [],
    };

    // Add date fields based on maintenance type
    const selectedType = this.maintenanceTypsLookup.find(type => type.id === formValue.maintenanceTypeId);
    const typeName = selectedType?.name;

    if (typeName === 'وقائي') {
      // For preventive: use planDay (single day)
      data.planDay = formValue.planDay ? this.formatDateWithoutTimezone(new Date(formValue.planDay)) : this.formatDateWithoutTimezone(new Date());
      data.dateFrom = formValue.planDay ? this.formatDateWithoutTimezone(new Date(formValue.planDay)) : this.formatDateWithoutTimezone(new Date());
      data.dateTo = formValue.planDay ? this.formatDateWithoutTimezone(new Date(formValue.planDay)) : this.formatDateWithoutTimezone(new Date());
    } else if (typeName === 'دوري') {
      // For periodic: use date range
      data.dateFrom = formValue.dateFrom ? this.formatDateWithoutTimezone(new Date(formValue.dateFrom)) : this.formatDateWithoutTimezone(new Date());
      data.dateTo = formValue.dateTo ? this.formatDateWithoutTimezone(new Date(formValue.dateTo)) : this.formatDateWithoutTimezone(new Date());
      data.planDay = this.formatDateWithoutTimezone(new Date());
    } else {
      // Default case: set all date fields to current date
      const currentDate = this.formatDateWithoutTimezone(new Date());
      data.dateFrom = currentDate;
      data.dateTo = currentDate;
      data.planDay = currentDate;
    }

    // Add id only for edit mode
    if (this.editMode && this.id) {
      data.id = Number(this.id);
    }

    return data;
  }

  // Create new maintenance plan
  createMaintenancePlan(data: any) {
    this._maintenancePlanService.addMaintenancePlan(data).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.showSuccess('تمت إضافة خطة الصيانة بنجاح');
        } else {
          this.showError(response.errors?.[0]?.message || 'خطأ في إضافة خطة الصيانة');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error creating maintenance plan:', error);
        this.showError('خطأ في إضافة خطة الصيانة');
        this.isLoading = false;
      }
    );
  }

  // Update existing maintenance plan
  updateMaintenancePlan(data: any) {
    this._maintenancePlanService.editMaintenancePlan(data).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.showSuccess('تم تعديل خطة الصيانة بنجاح');
        } else {
          this.showError(response.errors?.[0]?.message || 'خطأ في تعديل خطة الصيانة');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error updating maintenance plan:', error);
        this.showError('خطأ في تعديل خطة الصيانة');
        this.isLoading = false;
      }
    );
  }

  // Mark all form controls as touched for validation
  markFormGroupTouched() {
    Object.keys(this.maintenancePlanForm.controls).forEach(key => {
      this.maintenancePlanForm.get(key)?.markAsTouched();
    });
  }

  // Cancel and navigate back
  onCancelReq() {
    if (this.maintenancePlanForm.dirty) {
      this.alertWarning = true;
    } else {
      this._router.navigate(['/maintenance/maintenace-plan']);
    }
  }

  // Utility methods for alerts
  showSuccess(message: string) {
    this.alertSuccessMsg = message;
    this.alertSuccess = true;
  }

  showError(message: string) {
    this.alertErrorMsg = message;
    this.alertError = true;
  }

  // Alert event handlers
  alertSuccessFun(value: boolean) {
    if (value) {
      this.alertSuccess = false;
      this._router.navigate(['/maintenance-plan-settings/maintenace-plan']);
    }
  }

  alertWarningFun(value: boolean) {
    this.alertWarning = false;
    if (value) {
      this._router.navigate(['/maintenance-plan-settings/maintenace-plan']);
    }
  }

  alertErrorFun(value: boolean) {
    if (value) {
      this.alertError = false;
    }
  }
}
