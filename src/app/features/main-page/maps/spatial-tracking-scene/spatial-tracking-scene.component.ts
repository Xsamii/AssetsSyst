import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { MapControlsComponent } from '../spatial-tracking-map/components/map-controls/map-controls.component';
import { SpatialTrackingSceneService } from './services/spatial-tracking-scene.service';
import SceneView from '@arcgis/core/views/SceneView';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spatial-tracking-scene',
  standalone: true,
  imports: [CommonModule, BreadCrumbComponent, MapControlsComponent],
  templateUrl: './spatial-tracking-scene.component.html',
  styleUrls: ['./spatial-tracking-scene.component.scss'],
})
export class SpatialTrackingSceneComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('sceneViewNode', { static: true })
  sceneViewNode!: ElementRef<HTMLDivElement>;

  // Scene
  sceneView: SceneView | null = null;
  isLoading = false;

  // Panel visibility
  showLayerList = false;
  showBaseMap = false;
  showLegend = false;

  // Scene layer URLs
  private readonly MAIN_SCENE_LAYER_URL =
    'https://tiles.arcgis.com/tiles/FO8QSNbg7KTn0Nki/arcgis/rest/services/MechanicalEquipmentzone5664/SceneServer';

  private readonly ROOMS_SCENE_LAYER_URL =
    'https://tiles.arcgis.com/tiles/FO8QSNbg7KTn0Nki/arcgis/rest/services/Rooms/SceneServer';

  private readonly WALLS_SCENE_LAYER_URL =
    'https://tiles.arcgis.com/tiles/FO8QSNbg7KTn0Nki/arcgis/rest/services/Walls/SceneServer';

  // Simple visibility model for custom layer list
  layerVisibility = {
    main: true,
    rooms: true,
    walls: true,
  };

  // Pending element ID from query params
  private pendingElementId: string | null = null;
  private sceneViewInitialized: boolean = false;
  private layerLoaded: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private spatialTrackingSceneService: SpatialTrackingSceneService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for elementId in query params
    this.checkQueryParamsForElementId();
  }

  /**
   * Check query params for elementId
   */
  private checkQueryParamsForElementId(): void {
    // Read from snapshot first
    const elementId = this.route.snapshot.queryParams['elementId'];
    if (elementId) {
      this.pendingElementId = elementId;
      console.log('Element ID from query params:', elementId);
    }

    // Subscribe to query param changes
    this.route.queryParams.subscribe((params) => {
      if (
        params['elementId'] &&
        params['elementId'] !== this.pendingElementId
      ) {
        this.pendingElementId = params['elementId'];
        console.log(
          'Element ID updated from query params:',
          params['elementId']
        );
        this.checkIfReadyToProcessElementId();
      }
    });
  }

  /**
   * Check if ready to process element ID
   */
  private checkIfReadyToProcessElementId(): void {
    if (
      this.pendingElementId &&
      this.sceneViewInitialized &&
      this.layerLoaded &&
      this.sceneView
    ) {
      console.log('All conditions met, processing element ID');
      this.processElementIdFromQueryParams();
    }
  }

  /**
   * Process element ID from query params - zoom and highlight
   */
  private async processElementIdFromQueryParams(): Promise<void> {
    if (!this.pendingElementId) {
      return;
    }

    const elementId = this.pendingElementId;
    console.log('Processing element ID:', elementId);

    // Wait a bit to ensure layer is fully queryable
    setTimeout(async () => {
      try {
        await this.spatialTrackingSceneService.zoomToElement(elementId);
        console.log('Successfully zoomed to element:', elementId);

        // Clear query params after processing
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });

        // Clear pending element ID
        this.pendingElementId = null;
      } catch (error) {
        console.error('Error zooming to element:', error);
      }
    }, 1500);
  }

  ngAfterViewInit(): void {
    this.initializeScene();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    // Cleanup scene service
    this.spatialTrackingSceneService.destroy();
  }

  /**
   * Initialize the Esri scene
   */
  private async initializeScene(): Promise<void> {
    try {
      this.isLoading = true;

      // Step 1: Initialize the map with satellite imagery as default
      this.spatialTrackingSceneService.initializeMap('satellite');

      // Step 2: Initialize the scene view
      // Using LOCAL scene mode for better building visualization
      // Higher zoom (19) and tilt (75°) for viewing from all angles
      this.sceneView = this.spatialTrackingSceneService.initSceneView(
        this.sceneViewNode.nativeElement,
        [39.9089722, 21.4189526], // Center coordinates
        15, // Higher zoom level for closer initial view
        75, // Tilt angle (75 degrees) for better 3D perspective and viewing from all angles
        0 // Heading
      );

      // Step 3: Add main scene layer (Mechanical equipment)
      await this.spatialTrackingSceneService.addSceneLayer(
        this.MAIN_SCENE_LAYER_URL,
        'c70381a8779a40e78a93f740d1883911'
      );

      // Step 3.1: Add Rooms scene layer (3D rooms) as an additional overlay layer
      await this.spatialTrackingSceneService.addAdditionalSceneLayer(
        this.ROOMS_SCENE_LAYER_URL,
        '54cf836e00a24d9b8e451c4277f7d895'
      );

      // Step 3.2: Add Walls scene layer (3D walls) as an additional overlay layer
      await this.spatialTrackingSceneService.addAdditionalSceneLayer(
        this.WALLS_SCENE_LAYER_URL,
        'd8d79300e2fb4fc9a91fa2976b038802'
      );

      // Step 4: Initialize widgets after scene is ready
      this.sceneView.when().then(() => {
        // Mark scene view as initialized
        this.sceneViewInitialized = true;
        console.log('Scene view initialized');

        // Hide loading immediately when scene is ready
        this.isLoading = false;

        // Add LayerList widget
        this.spatialTrackingSceneService.addLayerList('sceneLayerListDiv');

        // Add BasemapGallery widget
        this.spatialTrackingSceneService.addBasemapGallery('sceneBaseMapDiv');

        // Add Legend widget
        this.spatialTrackingSceneService.addLegend('sceneLegendContainer');

        // Check if we can process pending element ID
        this.checkIfReadyToProcessElementId();
      });

      // Subscribe to scene view ready (backup/alternative path)
      const sceneViewReadySub =
        this.spatialTrackingSceneService.sceneViewReady.subscribe(
          (view: SceneView) => {
            console.log('Scene view ready from observable');
            this.sceneView = view;
          }
        );
      this.subscriptions.push(sceneViewReadySub);

      // Subscribe to layer added events
      const layerAddedSub =
        this.spatialTrackingSceneService.layerAdded.subscribe(
          ({ layerId, layer }) => {
            console.log('Layer added:', layerId, layer);
            // Mark layer as loaded
            this.layerLoaded = true;
            // Check if we can process pending element ID
            this.checkIfReadyToProcessElementId();
          }
        );
      this.subscriptions.push(layerAddedSub);
    } catch (error) {
      console.error('Error initializing scene:', error);
      this.isLoading = false;
    }
  }

  /**
   * Toggle layer list panel
   */
  toggleLayerList(): void {
    this.showLayerList = !this.showLayerList;
  }

  /**
   * Toggle basemap panel
   */
  toggleBaseMap(): void {
    this.showBaseMap = !this.showBaseMap;
  }

  /**
   * Toggle legend panel
   */
  toggleLegend(): void {
    this.showLegend = !this.showLegend;
  }

  /**
   * Handle custom layer visibility changes from checkboxes
   */
  onLayerVisibilityChange(
    layerKey: 'main' | 'rooms' | 'walls',
    event: Event
  ): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.layerVisibility[layerKey] = checked;

    // Map keys to actual layer IDs used when adding layers
    let targetLayerId: string | null = null;

    switch (layerKey) {
      case 'main':
        targetLayerId = 'c70381a8779a40e78a93f740d1883911';
        break;
      case 'rooms':
        targetLayerId = '54cf836e00a24d9b8e451c4277f7d895';
        break;
      case 'walls':
        targetLayerId = 'd8d79300e2fb4fc9a91fa2976b038802';
        break;
    }

    if (!targetLayerId) {
      return;
    }

    // Get map from the scene service to ensure we use the authoritative map instance
    const map = this.spatialTrackingSceneService.getMap();
    if (!map) {
      console.warn('Map is not initialized yet');
      return;
    }

    const layer = map.findLayerById(targetLayerId) as __esri.Layer | undefined;

    if (layer) {
      console.log(
        'Toggling visibility for layer',
        targetLayerId,
        'to',
        checked
      );
      layer.visible = checked;
    } else {
      console.warn('Layer not found for visibility toggle:', targetLayerId);
    }
  }
}

