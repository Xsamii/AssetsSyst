import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import ArcGISMap from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import SceneLayer from '@arcgis/core/layers/SceneLayer';
import BuildingSceneLayer from '@arcgis/core/layers/BuildingSceneLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Basemap from '@arcgis/core/Basemap';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

@Injectable({
  providedIn: 'root',
})
export class SpatialTrackingSceneService {
  private map: ArcGISMap | null = null;
  private sceneView: SceneView | null = null;
  private sceneLayer: SceneLayer | BuildingSceneLayer | null = null;
  private layerList: LayerList | null = null;
  private legend: Legend | null = null;

  private sceneViewReady$ = new Subject<SceneView>();
  private layerAdded$ = new Subject<{ layerId: string; layer: any }>();

  /**
   * Observable for scene view ready event
   */
  get sceneViewReady(): Observable<SceneView> {
    return this.sceneViewReady$.asObservable();
  }

  /**
   * Observable for layer added event
   */
  get layerAdded(): Observable<{ layerId: string; layer: any }> {
    return this.layerAdded$.asObservable();
  }

  /**
   * Initialize the map for 3D scene
   */
  initializeMap(basemap: string | Basemap = 'satellite'): void {
    if (basemap === 'satellite') {
      const satelliteBasemap = new Basemap({
        baseLayers: [
          new TileLayer({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
          }),
        ],
        title: 'صور جوية',
        id: 'satellite',
      });
      this.map = new ArcGISMap({
        basemap: satelliteBasemap,
        ground: 'world-elevation',
      });
    } else if (basemap instanceof Basemap) {
      this.map = new ArcGISMap({
        basemap: basemap,
        ground: 'world-elevation',
      });
    } else {
      try {
        this.map = new ArcGISMap({
          basemap: basemap,
          ground: 'world-elevation',
        });
      } catch (error) {
        console.warn(
          `Failed to load basemap "${basemap}", falling back to satellite`,
          error
        );
        const satelliteBasemap = new Basemap({
          baseLayers: [
            new TileLayer({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            }),
          ],
          title: 'صور جوية',
          id: 'satellite',
        });
        this.map = new ArcGISMap({
          basemap: satelliteBasemap,
          ground: 'world-elevation',
        });
      }
    }
  }

  /**
   * Initialize the scene view
   */
  initSceneView(
    container: string | HTMLDivElement,
    center: [number, number] = [39.9089722, 21.4189526],
    zoom: number = 16,
    tilt: number = 0,
    heading: number = 0
  ): SceneView {
    if (!this.map) {
      throw new Error('Map is not initialized. Call initializeMap() first.');
    }

    // Calculate camera position based on zoom (approximate height)
    const height = Math.pow(2, 20 - zoom) * 0.1; // Approximate height calculation

    this.sceneView = new SceneView({
      container: container,
      map: this.map,
      center: center,
      zoom: zoom,
      camera: {
        position: {
          longitude: center[0],
          latitude: center[1],
          z: height,
        },
        tilt: tilt,
        heading: heading,
      },
      ui: {
        components: [],
      },
    });

    // Remove attribution
    this.sceneView.ui.remove('attribution');

    // Add Fullscreen widget
    this.sceneView.ui.add(
      new Fullscreen({
        view: this.sceneView,
      }),
      'top-left'
    );

    // Log basemap info for debugging
    this.map.basemap
      .when(() => {
        console.log(
          'Basemap loaded:',
          this.map?.basemap?.title || this.map?.basemap?.id
        );
      })
      .catch((error) => {
        console.error('Error loading basemap:', error);
      });

    // Emit ready event after a short delay to ensure view is initialized
    this.sceneView.when().then(() => {
      console.log('Scene view initialized successfully');
      setTimeout(() => {
        this.sceneViewReady$.next(this.sceneView!);
      }, 100);
    });

    return this.sceneView;
  }

  /**
   * Add scene layer to the map
   * Automatically detects if it's a BuildingSceneLayer or regular SceneLayer
   */
  async addSceneLayer(url: string, layerId: string = 'scene-layer'): Promise<void> {
    if (!this.map) {
      throw new Error('Map is not initialized. Call initializeMap() first.');
    }

    try {
      // Remove existing scene layer if any
      if (this.sceneLayer) {
        this.map.remove(this.sceneLayer);
      }

      // Check layer type by fetching service metadata
      const serviceUrl = url.endsWith('?f=json') ? url : `${url}?f=json`;
      const response = await fetch(serviceUrl);
      const serviceInfo = await response.json();
      console.log('serviceInfo', serviceInfo);
      // Determine layer type and create appropriate layer
      if (serviceInfo.layerType === 'BuildingSceneLayer' || serviceInfo.layerType === 'Building') {
        // Create BuildingSceneLayer for building layers
        this.sceneLayer = new BuildingSceneLayer({
          url: url,
          id: layerId,
          title: serviceInfo.name || 'Zone 1 Layer 22',
        });
        console.log('Creating BuildingSceneLayer');
      } else {
        // Create regular SceneLayer for other scene layers
        this.sceneLayer = new SceneLayer({
          url: url,
          id: layerId,
          title: serviceInfo.name || 'Zone 1 Layer 22',
        });
        console.log('Creating SceneLayer');
      }

      // Add to map
      this.map.add(this.sceneLayer);

      // Wait for layer to load
      await this.sceneLayer.when();

      // Emit layer added event
      this.layerAdded$.next({ layerId: layerId, layer: this.sceneLayer });

      console.log('Scene layer added successfully:', layerId, 'Type:', serviceInfo.layerType);
    } catch (error) {
      console.error('Error adding scene layer:', error);
      throw error;
    }
  }

  /**
   * Get the current scene view
   */
  getSceneView(): SceneView | null {
    return this.sceneView;
  }

  /**
   * Get the current map
   */
  getMap(): ArcGISMap | null {
    return this.map;
  }

  /**
   * Get the scene layer
   */
  getSceneLayer(): SceneLayer | BuildingSceneLayer | null {
    return this.sceneLayer;
  }

  /**
   * Add LayerList widget
   */
  addLayerList(container: string | HTMLElement): void {
    if (!this.sceneView) {
      throw new Error('SceneView is not initialized. Call initSceneView() first.');
    }

    if (this.layerList) {
      this.layerList.destroy();
    }

    this.layerList = new LayerList({
      id: 'layerList',
      container: container,
      view: this.sceneView,
    });
  }

  /**
   * Add BasemapGallery widget
   */
  addBasemapGallery(container: string | HTMLElement): void {
    if (!this.sceneView) {
      throw new Error('SceneView is not initialized. Call initSceneView() first.');
    }

    const basemapGallery = new BasemapGallery({
      view: this.sceneView,
      container: container,
    });
  }

  /**
   * Add Legend widget
   */
  addLegend(container: string | HTMLElement): void {
    if (!this.sceneView) {
      throw new Error('SceneView is not initialized. Call initSceneView() first.');
    }

    if (this.legend) {
      this.legend.destroy();
    }

    this.legend = new Legend({
      id: 'legend',
      view: this.sceneView,
      container: container,
    });
  }

  /**
   * Zoom to layer extent
   */
  async zoomToLayer(): Promise<void> {
    if (!this.sceneView || !this.sceneLayer) {
      return;
    }

    try {
      await this.sceneLayer.when();
      if (this.sceneLayer.fullExtent) {
        await this.sceneView.goTo({
          target: this.sceneLayer.fullExtent,
          duration: 1000,
        });
      }
    } catch (error) {
      console.error('Error zooming to layer:', error);
    }
  }

  /**
   * Zoom to a specific element by ID
   * Note: This is a placeholder - actual implementation depends on how elements are identified in the 3D scene
   */
  async zoomToElement(elementId: string | number): Promise<void> {
    if (!this.sceneView || !this.sceneLayer) {
      console.error('Scene view or layer not initialized');
      return;
    }

    try {
      await this.sceneLayer.when();

      // For BuildingSceneLayer, we can query features by attributes
      // The exact field name depends on your data structure
      // This is a generic implementation that can be customized
      
      const query = (this.sceneLayer as any).createQuery?.();
      if (query) {
        // Try common field names for element ID
        query.where = `OBJECTID = ${elementId} OR ELEMENT_ID = '${elementId}' OR AssetCode = '${elementId}'`;
        query.returnGeometry = true;
        query.outFields = ['*'];

        const result = await (this.sceneLayer as any).queryFeatures?.(query);
        
        if (result && result.features && result.features.length > 0) {
          const feature = result.features[0];
          if (feature.geometry) {
            // Zoom to the feature's geometry
            await this.sceneView.goTo({
              target: feature.geometry,
              duration: 1000,
            });
            console.log('Zoomed to element:', elementId);
          }
        } else {
          console.warn(`No element found with ID: ${elementId}`);
          // Fallback: zoom to layer extent
          await this.zoomToLayer();
        }
      } else {
        // If query is not available, just zoom to layer extent
        console.warn('Query not available for scene layer, zooming to layer extent');
        await this.zoomToLayer();
      }
    } catch (error) {
      console.error('Error zooming to element:', error);
      // Fallback: zoom to layer extent
      await this.zoomToLayer();
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.layerList) {
      this.layerList.destroy();
      this.layerList = null;
    }

    if (this.legend) {
      this.legend.destroy();
      this.legend = null;
    }

    if (this.sceneView) {
      this.sceneView.destroy();
      this.sceneView = null;
    }

    if (this.map) {
      this.map.destroy();
      this.map = null;
    }

    this.sceneLayer = null;
  }
}

