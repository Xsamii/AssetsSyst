import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { MapControlsComponent } from './components/map-controls/map-controls.component';
import { SpatialTrackingMapService } from './services/spatial-tracking-map.service';
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

  // BuildName filter options
  buildNameOptions = [
    { label: 'الموقع العام لمنطقة 6', value: 'الموقع العام لمنطقة 6' },
    { label: 'سكن', value: 'سكن' },
    { label: 'مباني الكهرباء', value: 'مباني الكهرباء' },
    { label: 'مباني ذبخ و سلخ', value: 'مباني ذبخ و سلخ' },
    { label: 'مباني مضخات المياه', value: 'مباني مضخات المياه' }
  ];

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private spatialTrackingMapService: SpatialTrackingMapService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Initialize forms
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
      buildName: ['']
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
   * Handle BuildName filter change
   */
  async onBuildNameFilterChange(): Promise<void> {
    const buildName = this.filterForm.get('buildName')?.value;
    
    if (buildName) {
      // Filter the assets point layer and zoom to filtered features
      await this.spatialTrackingMapService.filterLayerByBuildName('assets-point-layer', buildName);
    } else {
      // Clear filter
      this.spatialTrackingMapService.clearLayerFilter('assets-point-layer');
    }
  }

  /**
   * Reset filters
   */
  async resetFilters(): Promise<void> {
    // Reset form first
    this.filterForm.reset({
      buildName: ''
    });
    
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

