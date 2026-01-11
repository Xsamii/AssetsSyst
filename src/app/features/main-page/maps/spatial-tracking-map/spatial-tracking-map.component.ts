import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
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
  DEFAULT_MAP_CONFIG
} from './spatial-tracking-map.config';
import MapView from '@arcgis/core/views/MapView';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spatial-tracking-map',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    BreadCrumbComponent,
    MapControlsComponent
  ],
  templateUrl: './spatial-tracking-map.component.html',
  styleUrls: ['./spatial-tracking-map.component.scss']
})
export class SpatialTrackingMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) mapViewNode!: ElementRef<HTMLDivElement>;

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
  height = 'calc(100vh - 200px)'; // Map height

  // Layer configurations
  availableLayers: LayerConfig[] = SPATIAL_TRACKING_LAYERS;
  basemapOptions = BASEMAP_OPTIONS;

  // Filter dropdown options (placeholders for now)
  slaughterhouseOptions: any[] = [];
  buildingOptions: any[] = [];
  floorOptions: any[] = [];
  roomOptions: any[] = [];

  // Selected filter names (for map filtering)
  private selectedSlaughterhouseName: string = '';
  private selectedBuildingName: string = '';
  private selectedFloorName: string = '';
  private selectedRoomName: string = '';

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private spatialTrackingMapService: SpatialTrackingMapService,
    private sharedService: SharedService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Load initial lookup data
    this.loadSlaughterhouseLookup();
  }

  ngAfterViewInit(): void {
    // Check if service URL is configured
    if (!FEATURE_SERVICE_URL || (typeof FEATURE_SERVICE_URL === 'string' && FEATURE_SERVICE_URL.trim() === '')) {
      console.warn('⚠️ FEATURE_SERVICE_URL is not configured. Please add your service URL in spatial-tracking-map.config.ts');
      console.warn('⚠️ The map will load but layers will not be displayed until the service URL is configured.');
    }
    
    this.initializeMap();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
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
      room: ['']
    });

    // Layer control form for toggling layers
    const layerControls: any = {};
    this.availableLayers.forEach(layer => {
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
          layers: this.availableLayers
        }
      );

      // Step 3: Add configured layers
      await this.spatialTrackingMapService.addConfiguredLayers(this.availableLayers);

      // Step 4: Initialize widgets after map is ready
      this.mapView.when().then(() => {
        // Add LayerList widget
        this.spatialTrackingMapService.addLayerList('layerListDiv');
        
        // Add BasemapGallery widget
        this.spatialTrackingMapService.addBasemapGallery('baseMapDiv');
        
        // Add Legend widget
        this.spatialTrackingMapService.addLegend('legendContainer');
      });

      // Subscribe to map view ready
      const mapViewReadySub = this.spatialTrackingMapService.mapViewReady.subscribe(
        (view) => {
          console.log('Map view is ready', view);
          // Hide loading immediately when map is ready
          this.isLoading = false;
        }
      );

      // Subscribe to layer events
      const layerAddedSub = this.spatialTrackingMapService.layerAdded.subscribe(
        ({ layerId, layer }) => {
          console.log('Layer added:', layerId, layer);
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
          this.slaughterhouseOptions = res.data.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      },
      error: (err) => {
        console.error('Error loading slaughterhouse lookup:', err);
      }
    });
  }

  /**
   * Load buildings based on slaughterhouse
   */
  loadBuildingsLookup(): void {
    this.sharedService.getAllBuilding().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.buildingOptions = res.data.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      },
      error: (err) => {
        console.error('Error loading buildings lookup:', err);
      }
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
          this.floorOptions = res.data.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      },
      error: (err) => {
        console.error('Error loading floors lookup:', err);
        this.floorOptions = [];
      }
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
          this.roomOptions = res.data.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      },
      error: (err) => {
        console.error('Error loading rooms lookup:', err);
        this.roomOptions = [];
      }
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
      room: ''
    });

    // Reset dependent filter names
    this.selectedBuildingName = '';
    this.selectedFloorName = '';
    this.selectedRoomName = '';

    const slaughterhouseId = this.filterForm.get('slaughterhouse')?.value;
    if (slaughterhouseId) {
      // Find and store the selected slaughterhouse name
      const selected = this.slaughterhouseOptions.find(opt => opt.value === slaughterhouseId);
      this.selectedSlaughterhouseName = selected?.label || '';

      // Load buildings for all slaughterhouses (not filtered by slaughterhouse)
      this.loadBuildingsLookup();
    } else {
      this.selectedSlaughterhouseName = '';
    }

    // Apply filter to map
    this.applyMapFilters();
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
      room: ''
    });

    // Reset dependent filter names
    this.selectedFloorName = '';
    this.selectedRoomName = '';

    const buildingId = this.filterForm.get('building')?.value;
    if (buildingId) {
      // Find and store the selected building name
      const selected = this.buildingOptions.find(opt => opt.value === buildingId);
      this.selectedBuildingName = selected?.label || '';

      this.loadFloorsLookup(buildingId);
    } else {
      this.selectedBuildingName = '';
    }

    // Apply filter to map
    this.applyMapFilters();
  }

  /**
   * Handle floor filter change
   */
  onFloorChange(): void {
    // Reset dependent dropdown
    this.roomOptions = [];

    this.filterForm.patchValue({
      room: ''
    });

    // Reset dependent filter names
    this.selectedRoomName = '';

    const floorId = this.filterForm.get('floor')?.value;
    if (floorId) {
      // Find and store the selected floor name
      const selected = this.floorOptions.find(opt => opt.value === floorId);
      this.selectedFloorName = selected?.label || '';

      this.loadRoomsLookup(floorId);
    } else {
      this.selectedFloorName = '';
    }

    // Apply filter to map
    this.applyMapFilters();
  }

  /**
   * Handle room filter change
   */
  onRoomChange(): void {
    const roomId = this.filterForm.get('room')?.value;
    if (roomId) {
      // Find and store the selected room name
      const selected = this.roomOptions.find(opt => opt.value === roomId);
      this.selectedRoomName = selected?.label || '';
    } else {
      this.selectedRoomName = '';
    }

    // Apply filter to map
    this.applyMapFilters();
  }

  /**
   * Apply filters to the map
   */
  private applyMapFilters(): void {
    this.spatialTrackingMapService.filterAssetLayer({
      slaughterhouseName: this.selectedSlaughterhouseName,
      buildName: this.selectedBuildingName,
      levelAsset: this.selectedFloorName,
      roomName: this.selectedRoomName
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
      room: ''
    });

    // Clear selected filter names
    this.selectedSlaughterhouseName = '';
    this.selectedBuildingName = '';
    this.selectedFloorName = '';
    this.selectedRoomName = '';

    // Clear dependent dropdown options (but keep slaughterhouse options)
    this.buildingOptions = [];
    this.floorOptions = [];
    this.roomOptions = [];

    // Reload slaughterhouse options
    this.loadSlaughterhouseLookup();

    // Clear layer filter and reset map view to default
    await this.spatialTrackingMapService.clearLayerFilterAndResetView('assets-point-layer');
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
}

