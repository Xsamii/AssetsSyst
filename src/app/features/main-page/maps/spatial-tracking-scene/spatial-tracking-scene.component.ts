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
  imports: [
    CommonModule,
    BreadCrumbComponent,
    MapControlsComponent,
  ],
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

  // Scene layer URL
  private readonly SCENE_LAYER_URL = 'https://tiles.arcgis.com/tiles/Qo5uglfIn4qL6z91/arcgis/rest/services/Zone1_Layer22/SceneServer';

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
      if (params['elementId'] && params['elementId'] !== this.pendingElementId) {
        this.pendingElementId = params['elementId'];
        console.log('Element ID updated from query params:', params['elementId']);
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
      this.sceneView = this.spatialTrackingSceneService.initSceneView(
        this.sceneViewNode.nativeElement,
        [39.9089722, 21.4189526], // Center coordinates
        16, // Zoom level
        0, // Tilt
        0 // Heading
      );

      // Step 3: Add scene layer
      await this.spatialTrackingSceneService.addSceneLayer(
        this.SCENE_LAYER_URL,
        '9dea858bc707489db79925b20e500f68'
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
}

