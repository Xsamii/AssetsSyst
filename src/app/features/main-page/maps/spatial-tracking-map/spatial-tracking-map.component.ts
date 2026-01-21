import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { AssetsService } from '../../buildings/components/assets/assets.service';
import { MapControlsComponent } from './components/map-controls/map-controls.component';
import { SpatialTrackingMapService } from './services/spatial-tracking-map.service';
import { SharedService } from 'src/app/Shared/services/shared.service';
import {
  SPATIAL_TRACKING_LAYERS,
  BASEMAP_OPTIONS,
  LayerConfig,
  getLayerConfigById,
  updateLayerVisibility,
  FEATURE_SERVICE_URL,
  DEFAULT_MAP_CONFIG,
} from './spatial-tracking-map.config';
import MapView from '@arcgis/core/views/MapView';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spatial-tracking-map',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    AutoCompleteModule,
    BreadCrumbComponent,
    MapControlsComponent,
  ],
  templateUrl: './spatial-tracking-map.component.html',
  styleUrls: ['./spatial-tracking-map.component.scss'],
})
export class SpatialTrackingMapComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('mapViewNode', { static: true })
  mapViewNode!: ElementRef<HTMLDivElement>;

  // Forms
  filterForm: FormGroup;
  layerControlForm: FormGroup;

  // Map
  mapView: MapView | null = null;
  isLoading = false;

  // Panel visibility
  showLayerList = false;
  showBaseMap = false;
  showLegend = false;
  showFilters = true; // Show filters
  showFilterDialog = false; // Filter dialog visibility
  height = 'calc(100vh - 200px)'; // Map height

  // Layer configurations
  availableLayers: LayerConfig[] = SPATIAL_TRACKING_LAYERS;
  basemapOptions = BASEMAP_OPTIONS;

  // Filter dropdown options (placeholders for now)
  slaughterhouseOptions: any[] = [];
  buildingOptions: any[] = [];
  floorOptions: any[] = [];
  roomOptions: any[] = [];
  systemNameOptions: any[] = [];
  subCategoryOptions: any[] = [];
  subCategoryTypeOptions: any[] = [];

  // Asset number autocomplete
  assetNumberSuggestions: any[] = [];
  selectedAssetNumber: string = '';
  selectedAssetData: any = null;

  // Selected filter codes (for map filtering)
  private selectedSlaughterhouseCode: string = '';
  private selectedBuildingCode: string = '';
  private selectedFloorName: string = ''; // Store English floor name for filtering (not code)
  private selectedRoomCode: string = ''; // For rooms layer filtering
  private selectedRoomName: string = ''; // For assets layer filtering
  private selectedSystemName: string = ''; // For assets layer filtering (SystemType)
  private selectedSubCategory: string = ''; // For assets layer filtering (sub_catogry)
  private selectedSubCategoryType: string = ''; // For assets layer filtering (Sub_catogryType)

  /**
   * Map Arabic floor code to English floor name for filtering
   */
  private mapFloorCodeToEnglishName(arabicCode: string): string {
    const floorMapping: { [key: string]: string } = {
      'الطابق الأرضي': 'Ground Floor',
      'الطابق الأول': 'First Floor',
      'الطابق الثاني': 'Second Floor',
    };
    return floorMapping[arabicCode] || arabicCode;
  }

  /**
   * Normalize room code: if it's a 7-digit number, pad with leading zero to make it 8 digits
   */
  private normalizeRoomCode(roomCode: string): string {
    if (!roomCode) return roomCode;

    // Check if the code is numeric and has 7 digits
    const numericCode = roomCode.trim();
    if (/^\d{7}$/.test(numericCode)) {
      // Pad with leading zero to make it 8 digits
      return '0' + numericCode;
    }

    // Return as-is if not a 7-digit number
    return roomCode;
  }

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private spatialTrackingMapService: SpatialTrackingMapService,
    private sharedService: SharedService,
    private assetsService: AssetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Check for asset ID in query params FIRST, before anything else
    this.checkQueryParamsForAssetId();

    // Load initial lookup data
    this.loadSlaughterhouseLookup();
  }

  ngAfterViewInit(): void {
    // Check if service URL is configured
    if (
      !FEATURE_SERVICE_URL ||
      (typeof FEATURE_SERVICE_URL === 'string' &&
        FEATURE_SERVICE_URL.trim() === '')
    ) {
      console.warn(
        '⚠️ FEATURE_SERVICE_URL is not configured. Please add your service URL in spatial-tracking-map.config.ts'
      );
      console.warn(
        '⚠️ The map will load but layers will not be displayed until the service URL is configured.'
      );
    }

    this.initializeMap();
  }

  /**
   * Setup popup action handler for 3D navigation
   */
  private setupPopupActionHandler(): void {
    if (!this.mapView) {
      console.warn('MapView not available for popup action handler');
      return;
    }

    console.log('Setting up popup action handler');

    // Use reactiveUtils to listen for popup action trigger
    reactiveUtils.on(
      () => this.mapView?.popup,
      'trigger-action',
      (event: any) => {
        console.log('Popup action triggered:', event.action.id);

        if (event.action.id === 'view-in-3d') {
          console.log('Navigating to 3D scene route');
          this.router.navigate(['/scene']);
        }
      }
    );

    // Use reactiveUtils.watch instead of popup.watch for ArcGIS API compatibility
    reactiveUtils.watch(
      () => this.mapView?.popup?.visible,
      (visible: boolean) => {
        if (
          visible &&
          this.mapView?.popup.features &&
          this.mapView.popup.features.length > 0
        ) {
          console.log(
            'Popup visible with features:',
            this.mapView.popup.features.length
          );
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    // Destroy map view
    this.spatialTrackingMapService.destroy();
  }

  /**
   * Initialize forms
   */
  private initializeForms(): void {
    // Filter form for filtering data
    this.filterForm = this.fb.group({
      slaughterhouse: [''],
      building: [''],
      floor: [''],
      room: [''],
      systemName: [''],
      subCategory: [''],
      subCategoryType: [''],
    });

    // Layer control form for toggling layers
    const layerControls: any = {};
    this.availableLayers.forEach((layer) => {
      layerControls[layer.id] = [layer.visible];
    });
    this.layerControlForm = this.fb.group(layerControls);
  }

  /**
   * Initialize the Esri map
   */
  private async initializeMap(): Promise<void> {
    try {
      this.isLoading = true;

      // Step 1: Initialize the map with satellite imagery as default
      this.spatialTrackingMapService.initializeMap('satellite');

      // Step 2: Initialize the map view with settings from config
      this.mapView = this.spatialTrackingMapService.initMapView(
        this.mapViewNode.nativeElement,
        {
          center: DEFAULT_MAP_CONFIG.center,
          zoom: DEFAULT_MAP_CONFIG.zoom,
          basemap: DEFAULT_MAP_CONFIG.basemap,
          layers: this.availableLayers,
        }
      );

      // Step 3: Add configured layers
      await this.spatialTrackingMapService.addConfiguredLayers(
        this.availableLayers
      );

      // Mark layers as loaded
      this.layersLoaded = true;
      console.log('All layers loaded');

      // Step 3.5: Ensure only slaughterhouse layer is visible initially
      this.spatialTrackingMapService.setInitialLayerVisibility();

      // Step 3.6: Zoom to slaughterhouse layer extent on initial load
      await this.spatialTrackingMapService.zoomToSlaughterhouseLayer();

      // Step 3.7: Load unique values for asset filters after layers are added
      // Call it here as a fallback in case the layerAdded event is not triggered for some reason
      console.log('Calling loadAssetFilterOptions() from initializeMap...');
      try {
        await this.loadAssetFilterOptions();
        console.log(
          'loadAssetFilterOptions() from initializeMap completed successfully'
        );
      } catch (error) {
        console.error(
          'Error in loadAssetFilterOptions() from initializeMap:',
          error
        );
      }

      // Check if we can process pending asset ID
      this.checkIfReadyToProcessAssetId();

      // Step 4: Initialize widgets after map is ready
      this.mapView.when().then(() => {
        // Mark map view as initialized
        this.mapViewInitialized = true;
        console.log('Map view initialized (from when())');

        // Hide loading immediately when map is ready
        this.isLoading = false;

        // Add LayerList widget
        this.spatialTrackingMapService.addLayerList('layerListDiv');

        // Add BasemapGallery widget
        this.spatialTrackingMapService.addBasemapGallery('baseMapDiv');

        // Add Legend widget
        this.spatialTrackingMapService.addLegend('legendContainer');

        // Setup popup action handler for 3D navigation
        this.setupPopupActionHandler();

        // Check if we can process pending asset ID
        this.checkIfReadyToProcessAssetId();
      });

      // Subscribe to map view ready (backup/alternative path)
      const mapViewReadySub =
        this.spatialTrackingMapService.mapViewReady.subscribe((view) => {
          console.log('Map view is ready (from observable)', view);
          // Hide loading immediately when map is ready
          this.isLoading = false;

          // Mark map view as initialized (if not already set)
          if (!this.mapViewInitialized) {
            this.mapViewInitialized = true;
            console.log('Map view initialized (from observable)');
          }

          // Setup popup action handler for 3D navigation
          this.setupPopupActionHandler();

          // Check if we can process pending asset ID
          this.checkIfReadyToProcessAssetId();
        });

      // Subscribe to layer events
      console.log('=== Subscribing to layerAdded events ===');
      const layerAddedSub = this.spatialTrackingMapService.layerAdded.subscribe(
        ({ layerId, layer }) => {
          console.log('=== LayerAdded event received in component ===');
          console.log('Layer ID:', layerId);
          console.log('Layer object:', layer);

          // If assets layer is added, check if we can process pending asset ID
          if (layerId === 'assets-point-layer') {
            console.log('=== Assets layer added event fired ===');
            console.log('Layer ID:', layerId);
            console.log('Layer object:', layer);
            // Wait a bit for layer to be fully ready, then check if we can process
            setTimeout(async () => {
              console.log(
                '=== Inside setTimeout callback for assets layer ==='
              );
              this.checkIfReadyToProcessAssetId();
              // Load unique values for asset filters - wait longer to ensure layer is queryable
              console.log('About to call loadAssetFilterOptions()...');
              try {
                await this.loadAssetFilterOptions();
                console.log('loadAssetFilterOptions() completed successfully');
              } catch (error) {
                console.error('Error in loadAssetFilterOptions():', error);
              }
            }, 2000);

            // Add popup action handler for 3D navigation
            this.setupPopupActionHandler();
          }
        }
      );

      this.subscriptions.push(mapViewReadySub, layerAddedSub);

      // Fallback: Hide loading after 15 seconds even if map view ready doesn't fire
      setTimeout(() => {
        if (this.isLoading) {
          console.warn('Map loading timeout - hiding loading indicator');
          this.isLoading = false;
        }
      }, 15000);
    } catch (error) {
      console.error('Error initializing map:', error);
      this.isLoading = false;
    }
  }

  /**
   * Handle layer visibility toggle
   */
  onLayerVisibilityChange(layerId: string, event: any): void {
    const visible = event.target.checked;

    // Update layer config
    updateLayerVisibility(layerId, visible);

    // Update map layer
    this.spatialTrackingMapService.updateLayerVisibility(layerId, visible);
  }

  /**
   * Handle basemap change
   */
  onBasemapChange(basemapId: string): void {
    this.spatialTrackingMapService.changeBasemap(basemapId);
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    // Implement filtering logic here
    console.log('Filter changed:', this.filterForm.value);
    // You can query layers based on filter criteria
  }

  /**
   * Load slaughterhouse lookup data
   */
  loadSlaughterhouseLookup(): void {
    this.sharedService.GetSites().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.slaughterhouseOptions = res.data.map((item) => ({
            label: item.name,
            value: item.id,
            code: item.code || '',
          }));
        }
      },
      error: (err) => {
        console.error('Error loading slaughterhouse lookup:', err);
      },
    });
  }

  /**
   * Load buildings based on slaughterhouse
   */
  loadBuildingsLookup(): void {
    this.sharedService.getAllBuilding().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.buildingOptions = res.data.map((item) => ({
            label: item.name,
            value: item.id,
            code: item.code || '',
          }));
        }
      },
      error: (err) => {
        console.error('Error loading buildings lookup:', err);
      },
    });
  }

  /**
   * Load floors based on building
   */
  loadFloorsLookup(buildingId: number): void {
    if (!buildingId) return;

    this.sharedService.GetBuildingFloors(buildingId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.floorOptions = res.data.map((item) => ({
            label: item.name,
            value: item.id,
            code: item.code || '',
          }));
        }
      },
      error: (err) => {
        console.error('Error loading floors lookup:', err);
        this.floorOptions = [];
      },
    });
  }

  /**
   * Load rooms based on floor
   */
  loadRoomsLookup(floorId: number): void {
    if (!floorId) return;

    this.sharedService.getOfficesInFloor(floorId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.roomOptions = res.data.map((item) => ({
            label: item.name,
            value: item.id,
            code: item.code || '',
          }));
        }
      },
      error: (err) => {
        console.error('Error loading rooms lookup:', err);
        this.roomOptions = [];
      },
    });
  }

  /**
   * Handle slaughterhouse filter change
   */
  onSlaughterhouseChange(): void {
    // Reset dependent dropdowns
    this.buildingOptions = [];
    this.floorOptions = [];
    this.roomOptions = [];

    this.filterForm.patchValue({
      building: '',
      floor: '',
      room: '',
    });

    // Reset dependent filter codes
    this.selectedBuildingCode = '';
    this.selectedFloorName = '';
    this.selectedRoomCode = '';
    this.selectedRoomName = '';

    const slaughterhouseId = this.filterForm.get('slaughterhouse')?.value;
    if (slaughterhouseId) {
      // Find and store the selected slaughterhouse code
      const selected = this.slaughterhouseOptions.find(
        (opt) => opt.value === slaughterhouseId
      );
      this.selectedSlaughterhouseCode = selected?.code || '';

      // Load buildings for all slaughterhouses (not filtered by slaughterhouse)
      this.loadBuildingsLookup();
    } else {
      this.selectedSlaughterhouseCode = '';
    }
  }

  /**
   * Handle building filter change
   */
  onBuildingChange(): void {
    // Reset dependent dropdowns
    this.floorOptions = [];
    this.roomOptions = [];

    this.filterForm.patchValue({
      floor: '',
      room: '',
    });

    // Reset dependent filter codes
    this.selectedFloorName = '';
    this.selectedRoomCode = '';
    this.selectedRoomName = '';

    const buildingId = this.filterForm.get('building')?.value;
    if (buildingId) {
      // Find and store the selected building code
      const selected = this.buildingOptions.find(
        (opt) => opt.value === buildingId
      );
      this.selectedBuildingCode = selected?.code || '';

      this.loadFloorsLookup(buildingId);
    } else {
      this.selectedBuildingCode = '';
    }
  }

  /**
   * Handle floor filter change
   */
  onFloorChange(): void {
    // Reset dependent dropdown
    this.roomOptions = [];

    this.filterForm.patchValue({
      room: '',
    });

    // Reset dependent filter codes
    this.selectedRoomCode = '';
    this.selectedRoomName = '';

    const floorId = this.filterForm.get('floor')?.value;
    if (floorId) {
      // Find and store the selected floor code, then map to English name
      const selected = this.floorOptions.find((opt) => opt.value === floorId);
      const arabicCode = selected?.code || '';
      this.selectedFloorName = this.mapFloorCodeToEnglishName(arabicCode);

      this.loadRoomsLookup(floorId);
    } else {
      this.selectedFloorName = '';
    }
  }

  /**
   * Handle room filter change
   */
  onRoomChange(): void {
    const roomId = this.filterForm.get('room')?.value;
    if (roomId) {
      // Find and store the selected room code and name
      const selected = this.roomOptions.find((opt) => opt.value === roomId);
      const rawCode = selected?.code || '';
      this.selectedRoomCode = this.normalizeRoomCode(rawCode); // For rooms layer
      this.selectedRoomName = selected?.label || ''; // For assets layer (RoomName field)
    } else {
      this.selectedRoomCode = '';
      this.selectedRoomName = '';
    }
  }

  /**
   * Load unique values for asset filter dropdowns
   */
  async loadAssetFilterOptions(): Promise<void> {
    console.log('=== loadAssetFilterOptions() CALLED ===');
    console.log('Service available:', !!this.spatialTrackingMapService);
    try {
      console.log('=== Starting to load asset filter options ===');

      // Load SystemName options
      console.log('Loading SystemName unique values...');
      const systemNames =
        await this.spatialTrackingMapService.getUniqueValuesFromAssetsLayer(
          'SystemType'
        );
      console.log('SystemName unique values:', systemNames);
      this.systemNameOptions = systemNames.map((value) => ({
        label: value,
        value: value,
      }));
      console.log('SystemName options array:', this.systemNameOptions);

      // Load sub_catogry options
      console.log('Loading sub_catogry unique values...');
      const subCategories =
        await this.spatialTrackingMapService.getUniqueValuesFromAssetsLayer(
          'sub_catogry'
        );
      console.log('sub_catogry unique values:', subCategories);
      this.subCategoryOptions = subCategories.map((value) => ({
        label: value,
        value: value,
      }));
      console.log('sub_catogry options array:', this.subCategoryOptions);

      // Load Sub_catogryType options
      console.log('Loading Sub_catogryType unique values...');
      const subCategoryTypes =
        await this.spatialTrackingMapService.getUniqueValuesFromAssetsLayer(
          'Sub_catogryType'
        );
      console.log('Sub_catogryType unique values:', subCategoryTypes);
      this.subCategoryTypeOptions = subCategoryTypes.map((value) => ({
        label: value,
        value: value,
      }));
      console.log(
        'Sub_catogryType options array:',
        this.subCategoryTypeOptions
      );

      console.log('=== Asset filter options loaded summary ===');
      console.log('SystemName count:', this.systemNameOptions.length);
      console.log('sub_catogry count:', this.subCategoryOptions.length);
      console.log('Sub_catogryType count:', this.subCategoryTypeOptions.length);
      console.log('=== End of asset filter options loading ===');
    } catch (error) {
      console.error('Error loading asset filter options:', error);
    }
  }

  /**
   * Handle system name filter change
   */
  onSystemNameChange(): void {
    const systemName = this.filterForm.get('systemName')?.value;
    this.selectedSystemName = systemName || '';
  }

  /**
   * Handle sub category filter change
   */
  onSubCategoryChange(): void {
    const subCategory = this.filterForm.get('subCategory')?.value;
    this.selectedSubCategory = subCategory || '';
  }

  /**
   * Handle sub category type filter change
   */
  onSubCategoryTypeChange(): void {
    const subCategoryType = this.filterForm.get('subCategoryType')?.value;
    this.selectedSubCategoryType = subCategoryType || '';
  }

  /**
   * Search assets by number for autocomplete
   * Only calls API after 2+ characters are entered
   */
  searchAssetNumber(event: any): void {
    const query = event.query;

    // Only search if query has 2 or more characters
    if (query && query.length >= 2) {
      this.assetsService.searchAssetsByNumber(query).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            this.assetNumberSuggestions = res.data;
          } else {
            this.assetNumberSuggestions = [];
          }
        },
        error: (err) => {
          console.error('Error searching assets by number:', err);
          this.assetNumberSuggestions = [];
        }
      });
    } else {
      this.assetNumberSuggestions = [];
    }
  }

  /**
   * Handle asset number selection from autocomplete
   * Calls getAssetByNumber, saves the data, and zooms to asset on map with popup
   */
  onAssetNumberSelect(event: any): void {
    const assetNumber = event.value || event;
    this.selectedAssetNumber = assetNumber;

    // Call getAssetByNumber API and save the result
    this.assetsService.getAssetByNumber(assetNumber).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.selectedAssetData = res.data;
          console.log('Asset data retrieved:', this.selectedAssetData);

          // Filter and zoom to the asset on the map, and open popup
          // The filterAndZoomToAsset method adds the leading "0" to match AssetCode format
          this.spatialTrackingMapService.filterAndZoomToAsset(assetNumber);
        }
      },
      error: (err) => {
        console.error('Error getting asset by number:', err);
      }
    });
  }

  /**
   * Handle asset number clear event
   * Resets the map filter when the autocomplete is cleared
   */
  onAssetNumberClear(): void {
    this.selectedAssetNumber = '';
    this.selectedAssetData = null;
    this.assetNumberSuggestions = [];
    // Clear the asset filter and reset map view
    this.spatialTrackingMapService.clearLayerFilterAndResetView();
  }

  /**
   * Handle asset number input change
   * Resets the map filter when the input becomes empty
   */
  onAssetNumberChange(value: string): void {
    if (!value || value.trim() === '') {
      this.selectedAssetData = null;
      this.assetNumberSuggestions = [];
      // Clear the asset filter and reset map view
      this.spatialTrackingMapService.clearLayerFilterAndResetView();
    }
  }

  /**
   * Apply filters to the map
   */
  private applyMapFilters(): void {
    this.spatialTrackingMapService.filterAssetLayer({
      slaughterhouseCode: this.selectedSlaughterhouseCode,
      buildingCode: this.selectedBuildingCode,
      floorName: this.selectedFloorName, // Use English floor name instead of code
      roomCode: this.selectedRoomCode, // For rooms layer filtering
      roomName: this.selectedRoomName, // For assets layer filtering
      systemName: this.selectedSystemName, // For assets layer filtering (SystemType)
      subCategory: this.selectedSubCategory, // For assets layer filtering (sub_catogry)
      subCategoryType: this.selectedSubCategoryType, // For assets layer filtering (Sub_catogryType)
    });
  }

  /**
   * Reset filters
   */
  async resetFilters(): Promise<void> {
    // Reset form first
    this.filterForm.reset({
      slaughterhouse: '',
      building: '',
      floor: '',
      room: '',
      systemName: '',
      subCategory: '',
      subCategoryType: '',
    });

    // Clear selected filter codes
    this.selectedSlaughterhouseCode = '';
    this.selectedBuildingCode = '';
    this.selectedFloorName = '';
    this.selectedRoomCode = '';
    this.selectedRoomName = '';
    this.selectedSystemName = '';
    this.selectedSubCategory = '';
    this.selectedSubCategoryType = '';

    // Clear asset number autocomplete
    this.selectedAssetNumber = '';
    this.selectedAssetData = null;
    this.assetNumberSuggestions = [];

    // Clear dependent dropdown options (but keep slaughterhouse options)
    this.buildingOptions = [];
    this.floorOptions = [];
    this.roomOptions = [];

    // Reload slaughterhouse options
    this.loadSlaughterhouseLookup();

    // Clear all layer filters and reset map view to default
    await this.spatialTrackingMapService.clearLayerFilterAndResetView();
  }

  /**
   * Get layer by ID
   */
  getLayerConfig(layerId: string): LayerConfig | undefined {
    return getLayerConfigById(layerId);
  }

  /**
   * Check if layer is visible
   */
  isLayerVisible(layerId: string): boolean {
    const layerConfig = getLayerConfigById(layerId);
    return layerConfig?.visible ?? false;
  }

  /**
   * Toggle layer list panel
   */
  toggleLayerList(): void {
    this.showLayerList = !this.showLayerList;
    // Close other panels
    if (this.showLayerList) {
      this.showBaseMap = false;
      this.showLegend = false;
    }
  }

  /**
   * Toggle basemap panel
   */
  toggleBaseMap(): void {
    this.showBaseMap = !this.showBaseMap;
    // Close other panels
    if (this.showBaseMap) {
      this.showLayerList = false;
      this.showLegend = false;
    }
  }

  /**
   * Toggle legend panel
   */
  toggleLegend(): void {
    this.showLegend = !this.showLegend;
    // Close other panels
    if (this.showLegend) {
      this.showLayerList = false;
      this.showBaseMap = false;
    }
  }

  /**
   * Open filter dialog
   */
  openFilterDialog(): void {
    this.showFilterDialog = true;
  }

  /**
   * Close filter dialog
   */
  closeFilterDialog(): void {
    this.showFilterDialog = false;
  }

  /**
   * Apply filters from dialog (called when clicking submit button)
   */
  applyFiltersFromDialog(): void {
    // Apply the filters to the map
    this.applyMapFilters();
    // Close the dialog
    this.showFilterDialog = false;
  }

  // Store asset ID from query params
  private pendingAssetId: string | null = null;
  private layersLoaded = false;
  private mapViewInitialized = false;

  /**
   * Check query params for asset ID and store it for later processing
   */
  private checkQueryParamsForAssetId(): void {
    // Check snapshot first (synchronous)
    const assetId = this.route.snapshot.queryParams['assetId'];
    if (assetId) {
      console.log('Found asset ID in query params:', assetId);
      this.pendingAssetId = assetId;
    }

    // Also subscribe to catch navigation changes
    this.route.queryParams.subscribe((params) => {
      if (params['assetId'] && params['assetId'] !== this.pendingAssetId) {
        console.log('Asset ID changed in query params:', params['assetId']);
        this.pendingAssetId = params['assetId'];
        // Check if we can process it now
        this.checkIfReadyToProcessAssetId();
      }
    });
  }

  /**
   * Check if map view and layers are ready, then process asset ID
   */
  private checkIfReadyToProcessAssetId(): void {
    console.log('checkIfReadyToProcessAssetId called', {
      pendingAssetId: this.pendingAssetId,
      mapViewInitialized: this.mapViewInitialized,
      layersLoaded: this.layersLoaded,
      mapView: !!this.mapView,
    });

    if (
      this.pendingAssetId &&
      this.mapViewInitialized &&
      this.layersLoaded &&
      this.mapView
    ) {
      console.log('All conditions met, processing asset ID');
      this.processAssetIdFromQueryParams();
    } else {
      console.log('Not ready yet, waiting...');
    }
  }

  /**
   * Process the pending asset ID - filter and zoom to it
   */
  private async processAssetIdFromQueryParams(): Promise<void> {
    if (!this.pendingAssetId) {
      console.log('No pending asset ID, returning early');
      return;
    }

    const assetId = this.pendingAssetId;
    console.log('Processing asset ID:', assetId);

    // Wait a bit more to ensure layers are fully queryable
    setTimeout(async () => {
      try {
        await this.spatialTrackingMapService.filterAndZoomToAsset(assetId);
        console.log('Successfully filtered and zoomed to asset:', assetId);

        // Clear query params after processing
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });

        // Clear pending asset ID
        this.pendingAssetId = null;
      } catch (error) {
        console.error('Error filtering and zooming to asset:', error);
      }
    }, 1500); // Wait for layers to be fully queryable
  }
}

