import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Basemap from '@arcgis/core/Basemap';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import Query from '@arcgis/core/rest/support/Query';
import { LayerConfig, DEFAULT_MAP_CONFIG } from '../spatial-tracking-map.config';

// Type alias for JavaScript Map to avoid conflict with Esri Map
type LayerMap = Map<string, any>;

@Injectable({
  providedIn: 'root',
})
export class SpatialTrackingMapService {
  private map: ArcGISMap | null = null;
  private mapView: MapView | null = null;
  private layers: LayerMap = new Map();
  private layerList: LayerList | null = null;
  private legend: Legend | null = null;
  private extentHistory: __esri.Extent[] = [];
  private currentExtentIndex: number = -1;
  private homeExtent: __esri.Extent | null = null;
  private highlightGraphicsLayer: GraphicsLayer | null = null;
  private highlightHandle: any = null;

  private mapViewReady$ = new Subject<MapView>();
  private layerAdded$ = new Subject<{ layerId: string; layer: any }>();
  private layerRemoved$ = new Subject<string>();

  /**
   * Observable for map view ready event
   */
  get mapViewReady(): Observable<MapView> {
    return this.mapViewReady$.asObservable();
  }

  /**
   * Observable for layer added event
   */
  get layerAdded(): Observable<{ layerId: string; layer: any }> {
    return this.layerAdded$.asObservable();
  }

  /**
   * Observable for layer removed event
   */
  get layerRemoved(): Observable<string> {
    return this.layerRemoved$.asObservable();
  }

  /**
   * Initialize the map
   */
  initializeMap(basemap: string | Basemap = 'satellite'): void {
    // If basemap is 'satellite', create a custom satellite basemap to ensure it works
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
      });
    } else if (basemap instanceof Basemap) {
      this.map = new ArcGISMap({
        basemap: basemap,
      });
    } else {
      // Try to use the basemap ID, fallback to satellite if it fails
      try {
        this.map = new ArcGISMap({
          basemap: basemap,
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
        });
      }
    }
  }

  /**
   * Initialize the map view
   */
  initMapView(
    container: string | HTMLDivElement,
    config?: Partial<typeof DEFAULT_MAP_CONFIG>
  ): MapView {
    if (!this.map) {
      throw new Error('Map is not initialized. Call initializeMap() first.');
    }

    const mapConfig = { ...DEFAULT_MAP_CONFIG, ...config };

    this.mapView = new MapView({
      container: container,
      map: this.map,
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      ui: {
        components: [],
      },
    });

    // Enable popup
    this.mapView.popupEnabled = true;

    // Remove attribution
    this.mapView.ui.remove('attribution');

    // Add Fullscreen widget
    this.mapView.ui.add(
      new Fullscreen({
        view: this.mapView,
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

    // Save initial extent as home
    this.mapView
      .when()
      .then(() => {
        this.homeExtent = this.mapView!.extent.clone();
        console.log('Map view initialized successfully');
      })
      .catch((error) => {
        console.error('Error initializing map view:', error);
      });

    // Track extent changes for navigation
    this.mapView.watch('stationary', (stationary) => {
      if (stationary && this.mapView) {
        this.saveExtent(this.mapView.extent);
      }
    });

    // Emit ready event after a short delay to ensure view is initialized
    setTimeout(() => {
      this.mapViewReady$.next(this.mapView!);
    }, 100);

    return this.mapView;
  }

  /**
   * Save extent to history
   */
  private saveExtent(extent: __esri.Extent): void {
    // Remove any extents after current index (when user navigates back then moves)
    if (this.currentExtentIndex < this.extentHistory.length - 1) {
      this.extentHistory = this.extentHistory.slice(
        0,
        this.currentExtentIndex + 1
      );
    }

    // Add new extent
    this.extentHistory.push(extent.clone());
    this.currentExtentIndex = this.extentHistory.length - 1;

    // Limit history size
    if (this.extentHistory.length > 50) {
      this.extentHistory.shift();
      this.currentExtentIndex--;
    }
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    if (this.mapView) {
      const zoom = this.mapView.zoom + 1;
      this.mapView.goTo({ zoom: zoom });
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (this.mapView) {
      const zoom = this.mapView.zoom - 1;
      this.mapView.goTo({ zoom: zoom });
    }
  }

  /**
   * Go to home extent
   */
  async goHome(): Promise<void> {
    if (this.mapView) {
      if (this.homeExtent) {
        await this.mapView.goTo(this.homeExtent);
      } else {
        // Use default center and zoom from config
        const { DEFAULT_MAP_CONFIG } = await import(
          '../spatial-tracking-map.config'
        );
        await this.mapView.goTo({
          center: DEFAULT_MAP_CONFIG.center,
          zoom: DEFAULT_MAP_CONFIG.zoom,
        });
      }
    }
  }

  /**
   * Go back to previous extent
   */
  async goBackExtent(): Promise<void> {
    if (this.mapView && this.currentExtentIndex > 0) {
      this.currentExtentIndex--;
      await this.mapView.goTo(this.extentHistory[this.currentExtentIndex]);
    }
  }

  /**
   * Go forward to next extent
   */
  async goForwardExtent(): Promise<void> {
    if (
      this.mapView &&
      this.currentExtentIndex < this.extentHistory.length - 1
    ) {
      this.currentExtentIndex++;
      await this.mapView.goTo(this.extentHistory[this.currentExtentIndex]);
    }
  }

  /**
   * Get the current map view
   */
  getMapView(): MapView | null {
    return this.mapView;
  }

  /**
   * Get the current map
   */
  getMap(): ArcGISMap | null {
    return this.map;
  }

  /**
   * Add LayerList widget
   */
  addLayerList(container: string | HTMLElement): void {
    if (!this.mapView) {
      throw new Error('MapView is not initialized. Call initMapView() first.');
    }

    this.layerList = new LayerList({
      id: 'layerList',
      container: container,
      view: this.mapView,
    });
  }

  /**
   * Get LayerList widget
   */
  getLayerList(): LayerList | null {
    return this.layerList;
  }

  /**
   * Add Legend widget
   */
  addLegend(container: string | HTMLElement): void {
    if (!this.mapView) {
      throw new Error('MapView is not initialized. Call initMapView() first.');
    }

    this.legend = new Legend({
      id: 'legend',
      view: this.mapView,
      container: container,
    });
  }

  /**
   * Get Legend widget
   */
  getLegend(): Legend | null {
    return this.legend;
  }

  /**
   * Add BasemapGallery widget
   */
  addBasemapGallery(
    container: string | HTMLElement,
    customBasemaps?: Basemap[]
  ): void {
    if (!this.mapView) {
      throw new Error('MapView is not initialized. Call initMapView() first.');
    }

    // Create custom basemap - Satellite Imagery
    const customSatellite = new Basemap({
      baseLayers: [
        new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        }),
      ],
      title: 'صور جوية',
      id: 'custom-satellite',
    });

    // Create custom basemap - Hybrid (Satellite + Labels)
    const customHybrid = new Basemap({
      baseLayers: [
        new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        }),
        new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer',
        }),
      ],
      title: 'هجين',
      id: 'custom-hybrid',
    });

    // Create custom basemap - Light Gray Canvas
    const customLightGray = new Basemap({
      baseLayers: [
        new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer',
        }),
      ],
      title: 'رمادي فاتح',
      id: 'custom-light-gray',
    });

    // Create custom basemap - World Topographic
    const customTopo = new Basemap({
      baseLayers: [
        new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
        }),
      ],
      title: 'طبوغرافي',
      id: 'custom-topo',
    });

    // Try to use built-in basemaps, fallback to custom if they fail
    const defaultBasemaps: Basemap[] = [];

    try {
      defaultBasemaps.push(Basemap.fromId('satellite') || customSatellite);
    } catch {
      defaultBasemaps.push(customSatellite);
    }

    try {
      defaultBasemaps.push(Basemap.fromId('hybrid') || customHybrid);
    } catch {
      defaultBasemaps.push(customHybrid);
    }

    defaultBasemaps.push(customTopo);

    try {
      defaultBasemaps.push(Basemap.fromId('streets-vector'));
    } catch {
      // Fallback to streets if streets-vector doesn't work
      try {
        defaultBasemaps.push(Basemap.fromId('streets'));
      } catch {
        // Use custom streets if both fail
        defaultBasemaps.push(
          new Basemap({
            baseLayers: [
              new TileLayer({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
              }),
            ],
            title: 'شوارع',
            id: 'custom-streets',
          })
        );
      }
    }

    defaultBasemaps.push(customLightGray);

    try {
      defaultBasemaps.push(Basemap.fromId('topo-vector'));
    } catch {
      // Already added customTopo above
    }

    try {
      defaultBasemaps.push(Basemap.fromId('dark-gray-vector'));
    } catch {
      // Use custom dark gray if built-in doesn't work
      defaultBasemaps.push(
        new Basemap({
          baseLayers: [
            new TileLayer({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
            }),
          ],
          title: 'رمادي داكن',
          id: 'custom-dark-gray',
        })
      );
    }

    try {
      defaultBasemaps.push(Basemap.fromId('navigation'));
    } catch {
      // Use custom navigation if built-in doesn't work
      defaultBasemaps.push(
        new Basemap({
          baseLayers: [
            new TileLayer({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Navigation_Charts/MapServer',
            }),
          ],
          title: 'ملاحة',
          id: 'custom-navigation',
        })
      );
    }

    const basemapGallery = new BasemapGallery({
      view: this.mapView,
      container: container,
      source: customBasemaps
        ? [...customBasemaps, ...defaultBasemaps]
        : defaultBasemaps,
    });
  }

  /**
   * Add a feature layer to the map
   */
  addFeatureLayer(
    url: string,
    title: string,
    layerVisible: boolean = true,
    template?: PopupTemplate | any,
    renderer?: any
  ): FeatureLayer | undefined {
    if (!this.map) {
      console.error('Map is not initialized. Call initializeMap() first.');
      return undefined;
    }

    if (!url || url.trim() === '' || url.startsWith('/')) {
      console.warn(`Invalid URL for layer "${title}": ${url}`);
      return undefined;
    }

    const layerOptions: __esri.FeatureLayerProperties = {
      url,
      title,
      visible: layerVisible,
    };

    if (template) {
      layerOptions.popupTemplate = template;
    }

    const featureLayer = new FeatureLayer(layerOptions);

    if (renderer) {
      featureLayer.when(() => {
        featureLayer.renderer = renderer;
      });
    }

    this.map.add(featureLayer);
    this.layers.set(title, featureLayer);

    // Wait for layer to load
    featureLayer
      .when()
      .then(() => {
        this.layerAdded$.next({ layerId: title, layer: featureLayer });
      })
      .catch((error) => {
        console.error(`Error loading layer ${title}:`, error);
      });

    return featureLayer;
  }

  /**
   * Add a layer based on configuration
   */
  async addLayer(layerConfig: LayerConfig): Promise<any> {
    if (!this.map) {
      throw new Error('Map is not initialized. Call initializeMap() first.');
    }

    if (
      !layerConfig.url ||
      layerConfig.url.trim() === '' ||
      layerConfig.url.startsWith('/')
    ) {
      console.warn(
        `Invalid URL for layer "${layerConfig.name}": ${layerConfig.url}`
      );
      return null;
    }

    let layer: any;

    switch (layerConfig.type) {
      case 'feature':
        const featureLayerOptions: any = {
          url: layerConfig.url,
          id: layerConfig.id,
          title: layerConfig.name,
          opacity: layerConfig.opacity ?? 1,
          visible: layerConfig.visible,
          minScale: layerConfig.minScale,
          maxScale: layerConfig.maxScale,
          outFields: layerConfig.outFields ?? ['*'],
          labelingInfo: layerConfig.labelingInfo,
          definitionExpression: layerConfig.definitionExpression,
        };

        // Only add popupTemplate if popup is enabled
        if (layerConfig.popupEnabled && layerConfig.popupTemplate) {
          featureLayerOptions.popupTemplate = layerConfig.popupTemplate;
        } else {
          featureLayerOptions.popupEnabled = false;
        }

        layer = new FeatureLayer(featureLayerOptions);

        // Don't apply any renderer - use original symbology from the service
        // The layer will use its default renderer from the ArcGIS service

        break;

      case 'tile':
        layer = new TileLayer({
          url: layerConfig.url,
          id: layerConfig.id,
          title: layerConfig.name,
          opacity: layerConfig.opacity ?? 1,
          visible: layerConfig.visible,
          minScale: layerConfig.minScale,
          maxScale: layerConfig.maxScale,
        });
        break;

      case 'imagery':
        layer = new ImageryLayer({
          url: layerConfig.url,
          id: layerConfig.id,
          title: layerConfig.name,
          opacity: layerConfig.opacity ?? 1,
          visible: layerConfig.visible,
          minScale: layerConfig.minScale,
          maxScale: layerConfig.maxScale,
        });
        break;

      case 'vector':
        layer = new VectorTileLayer({
          url: layerConfig.url,
          id: layerConfig.id,
          title: layerConfig.name,
          opacity: layerConfig.opacity ?? 1,
          visible: layerConfig.visible,
          minScale: layerConfig.minScale,
          maxScale: layerConfig.maxScale,
        });
        break;

      case 'map-image':
        layer = new MapImageLayer({
          url: layerConfig.url,
          id: layerConfig.id,
          title: layerConfig.name,
          opacity: layerConfig.opacity ?? 1,
          visible: layerConfig.visible,
          minScale: layerConfig.minScale,
          maxScale: layerConfig.maxScale,
        });
        break;

      case 'graphics':
        layer = new GraphicsLayer({
          id: layerConfig.id,
          title: layerConfig.name,
          opacity: layerConfig.opacity ?? 1,
          visible: layerConfig.visible,
        });
        break;

      default:
        throw new Error(`Unsupported layer type: ${layerConfig.type}`);
    }

    // Add layer to map
    this.map.add(layer);

    // Store layer reference
    this.layers.set(layerConfig.id, layer);

    // Wait for layer to load
    try {
      await Promise.race([
        layer.when(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Layer ${layerConfig.id} load timeout`)),
            15000
          )
        ),
      ]);
    } catch (error) {
      console.error(`Error loading layer ${layerConfig.id}:`, error);
      // Still add the layer even if it fails to load completely
    }

    // Emit layer added event
    this.layerAdded$.next({ layerId: layerConfig.id, layer });

    return layer;
  }

  /**
   * Check if symbol type is compatible with geometry type
   */
  private isSymbolTypeCompatible(
    symbolType: string,
    geometryType: string
  ): boolean {
    const compatibility: { [key: string]: string[] } = {
      point: ['simple-marker', 'picture-marker', 'text'],
      multipoint: ['simple-marker', 'picture-marker', 'text'],
      polyline: ['simple-line', 'cartographic-line', 'picture-line', 'text'],
      polygon: ['simple-fill', 'picture-fill', 'text'],
    };

    const compatibleSymbols = compatibility[geometryType?.toLowerCase()] || [];
    return compatibleSymbols.includes(symbolType);
  }

  /**
   * Create appropriate renderer based on geometry type
   */
  private createRendererForGeometryType(
    geometryType: string,
    fallbackRenderer?: any
  ): any {
    // Extract color from fallback renderer if provided
    let color = [0, 112, 255, 1]; // Default blue
    let outlineColor = [255, 255, 255, 1];
    let outlineWidth = 2;

    if (fallbackRenderer?.symbol) {
      if (fallbackRenderer.symbol.color) {
        color = fallbackRenderer.symbol.color;
      }
      if (fallbackRenderer.symbol.outline?.color) {
        outlineColor = fallbackRenderer.symbol.outline.color;
      }
      if (fallbackRenderer.symbol.outline?.width !== undefined) {
        outlineWidth = fallbackRenderer.symbol.outline.width;
      }
    }

    const geometryTypeLower = geometryType?.toLowerCase() || '';

    switch (geometryTypeLower) {
      case 'point':
      case 'multipoint':
        return new SimpleRenderer({
          symbol: new SimpleMarkerSymbol({
            style: fallbackRenderer?.symbol?.style || 'circle',
            size: fallbackRenderer?.symbol?.size || 8,
            color: color,
            outline: {
              color: outlineColor,
              width: outlineWidth,
            },
          }),
        });

      case 'polyline':
        return new SimpleRenderer({
          symbol: new SimpleLineSymbol({
            style: 'solid',
            color: color,
            width: fallbackRenderer?.symbol?.width || 2,
          }),
        });

      case 'polygon':
        return new SimpleRenderer({
          symbol: new SimpleFillSymbol({
            style: 'solid',
            color: color,
            outline: {
              color: outlineColor,
              width: outlineWidth,
            },
          }),
        });

      default:
        // Default to point symbol if geometry type is unknown
        return new SimpleRenderer({
          symbol: new SimpleMarkerSymbol({
            style: 'circle',
            size: 8,
            color: color,
            outline: {
              color: outlineColor,
              width: outlineWidth,
            },
          }),
        });
    }
  }

  /**
   * Add configured layers to the map
   */
  async addConfiguredLayers(layerConfigs: LayerConfig[]): Promise<void> {
    // ArcGIS JS draws the last added layer on top.
    // To make sure the desired top layers (like assets) are above others,
    // add layers in reverse order of the provided configs.
    const layersToAdd = [...layerConfigs].reverse();

    for (const layerConfig of layersToAdd) {
      if (
        layerConfig.visible &&
        layerConfig.url &&
        layerConfig.url.trim() !== '' &&
        !layerConfig.url.startsWith('/')
      ) {
        try {
          await this.addLayer(layerConfig);
        } catch (error) {
          console.error(`Error adding layer ${layerConfig.id}:`, error);
          // Continue with other layers even if one fails
        }
      } else if (
        layerConfig.visible &&
        (!layerConfig.url ||
          layerConfig.url.trim() === '' ||
          layerConfig.url.startsWith('/'))
      ) {
        console.warn(
          `Layer ${layerConfig.id} has invalid or empty URL. Skipping.`
        );
      }
    }
  }

  /**
   * Remove a layer from the map
   */
  removeLayer(layerId: string): boolean {
    if (!this.map) {
      return false;
    }

    const layer = this.layers.get(layerId);
    if (layer) {
      this.map.remove(layer);
      this.layers.delete(layerId);
      this.layerRemoved$.next(layerId);
      return true;
    }

    return false;
  }

  /**
   * Update layer visibility
   */
  updateLayerVisibility(layerId: string, visible: boolean): boolean {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.visible = visible;
      return true;
    }
    return false;
  }

  /**
   * Update layer opacity
   */
  updateLayerOpacity(layerId: string, opacity: number): boolean {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
      return true;
    }
    return false;
  }

  /**
   * Get a layer by ID
   */
  getLayer(layerId: string): any {
    return this.layers.get(layerId);
  }

  /**
   * Get all layers
   */
  getAllLayers(): any[] {
    return Array.from(this.layers.values());
  }

  /**
   * Zoom to a specific location
   */
  async zoomTo(center: [number, number], zoom?: number): Promise<void> {
    if (this.mapView) {
      await this.mapView.goTo({
        center: center,
        zoom: zoom ?? this.mapView.zoom,
      });
    }
  }

  /**
   * Zoom to extent
   */
  async zoomToExtent(extent: any): Promise<void> {
    if (this.mapView) {
      await this.mapView.goTo(extent);
    }
  }

  /**
   * Change basemap
   */
  changeBasemap(basemapId: string): void {
    if (this.map) {
      this.map.basemap = basemapId;
    }
  }

  /**
   * Destroy the map view and clean up
   */
  destroy(): void {
    if (this.mapView) {
      this.mapView.destroy();
      this.mapView = null;
    }
    if (this.map) {
      this.map = null;
    }
    this.layers.clear();
    this.layerList = null;
    this.legend = null;
  }

  /**
   * Refresh a layer
   */
  async refreshLayer(layerId: string): Promise<void> {
    const layer = this.layers.get(layerId);
    if (layer && layer.refresh) {
      await layer.refresh();
    }
  }

  /**
   * Query features from a feature layer
   */
  async queryFeatures(layerId: string, query?: any): Promise<any> {
    const layer = this.layers.get(layerId);
    if (layer && layer.queryFeatures) {
      return await layer.queryFeatures(query);
    }
    return null;
  }

  /**
   * Filter layer by BuildName and zoom to filtered features
   */
  async filterLayerByBuildName(
    layerId: string,
    buildName: string
  ): Promise<void> {
    const layer = this.layers.get(layerId) as FeatureLayer;
    if (!layer || !this.mapView) {
      console.error(`Layer ${layerId} not found or map view not initialized`);
      return;
    }

    try {
      // Set definition expression to filter by BuildName
      // Escape single quotes in the buildName value
      const escapedBuildName = buildName.replace(/'/g, "''");
      const definitionExpression = `BuildName = '${escapedBuildName}'`;
      layer.definitionExpression = definitionExpression;

      console.log(`Filtering layer ${layerId} by BuildName: ${buildName}`);

      // Also filter the buildings layer
      const buildingsLayer = this.layers.get('buildings-layer') as FeatureLayer;
      if (buildingsLayer) {
        buildingsLayer.definitionExpression = definitionExpression;
        console.log(`Filtering buildings layer by BuildName: ${buildName}`);

        // Flash/highlight filtered buildings
        await this.flashFilteredBuildings(buildingsLayer, definitionExpression);
      }

      // Wait for layer to update
      await layer.when();

      // Query filtered features to get their extent
      // Use queryExtent to get the extent directly (more efficient)
      const extentQuery = layer.createQuery();
      extentQuery.where = definitionExpression;
      extentQuery.returnGeometry = false;

      const extentResult = await layer.queryExtent(extentQuery);

      if (extentResult && extentResult.extent) {
        // Check if extent is valid (has width and height)
        const extent = extentResult.extent;
        const width = extent.xmax - extent.xmin;
        const height = extent.ymax - extent.ymin;

        if (width > 0 && height > 0) {
          // Zoom to the extent with padding
          await this.mapView.goTo(extent.expand(1.2), {
            duration: 1000,
          });
          console.log(
            `Zoomed to filtered features extent (count: ${extentResult.count})`
          );
        } else {
          // Fallback: Query a few features and calculate extent manually
          const query = layer.createQuery();
          query.where = definitionExpression;
          query.returnGeometry = true;
          query.outFields = ['*'];
          query.num = 100; // Limit to avoid performance issues

          const result = await layer.queryFeatures(query);

          if (result.features && result.features.length > 0) {
            console.log(
              `Found ${result.features.length} features, calculating extent manually`
            );

            // Get extent of all filtered features
            let calculatedExtent: __esri.Extent | null = null;

            for (let i = 0; i < result.features.length; i++) {
              const feature = result.features[i];
              if (feature.geometry) {
                // Try to get extent from geometry
                let featureExtent: __esri.Extent | null = null;

                if (feature.geometry.extent) {
                  featureExtent = feature.geometry.extent;
                } else if (feature.geometry.type === 'point') {
                  // For points, create a small extent around the point
                  const point = feature.geometry as __esri.Point;
                  const buffer = 0.001; // Small buffer in degrees
                  featureExtent = {
                    xmin: point.longitude - buffer,
                    ymin: point.latitude - buffer,
                    xmax: point.longitude + buffer,
                    ymax: point.latitude + buffer,
                    spatialReference: point.spatialReference,
                  } as __esri.Extent;
                } else if ('extent' in feature.geometry) {
                  featureExtent = (feature.geometry as any).extent;
                }

                if (featureExtent) {
                  if (calculatedExtent === null) {
                    calculatedExtent = featureExtent.clone();
                  } else {
                    calculatedExtent = calculatedExtent.union(featureExtent);
                  }
                }
              }
            }

            // Zoom to the extent with padding if extent is valid
            if (calculatedExtent) {
              const calcWidth = calculatedExtent.xmax - calculatedExtent.xmin;
              const calcHeight = calculatedExtent.ymax - calculatedExtent.ymin;

              if (calcWidth > 0 && calcHeight > 0) {
                await this.mapView.goTo(calculatedExtent.expand(1.2), {
                  duration: 1000,
                });
                console.log(
                  `Zoomed to ${result.features.length} filtered features`
                );
              } else {
                console.warn(
                  `Calculated extent is invalid (width: ${calcWidth}, height: ${calcHeight})`
                );
              }
            } else {
              console.warn(`No valid extent found for filtered features`);
            }
          } else {
            console.warn(`No features found for BuildName: ${buildName}`);
          }
        }
      } else {
        console.warn(`No extent result returned from queryExtent`);
      }
    } catch (error) {
      console.error(`Error filtering layer ${layerId}:`, error);
    }
  }

  /**
   * Clear layer filter for all layers
   */
  clearLayerFilter(layerId?: string): void {
    // Clear all layers
    const layersToClear = [
      'assets-point-layer',
      'rooms-layer',
      'buildings-layer',
      'slaughterhouse-layer',
    ];

    layersToClear.forEach((layerIdToClear) => {
      const layer = this.layers.get(layerIdToClear);
      if (layer) {
        layer.definitionExpression = '';
        console.log(`Cleared filter for layer ${layerIdToClear}`);
      }
    });

    // Clear highlight graphics
    this.clearHighlightGraphics();
  }

  /**
   * Flash/highlight filtered buildings
   */
  private async flashFilteredBuildings(
    buildingsLayer: FeatureLayer,
    definitionExpression: string
  ): Promise<void> {
    if (!this.map || !this.mapView) {
      return;
    }

    try {
      // Clear previous highlights
      this.clearHighlightGraphics();

      // Query filtered buildings
      const query = buildingsLayer.createQuery();
      query.where = definitionExpression;
      query.returnGeometry = true;
      query.outFields = ['*'];

      const result = await buildingsLayer.queryFeatures(query);

      if (result.features && result.features.length > 0) {
        // Create or get highlight graphics layer
        if (!this.highlightGraphicsLayer) {
          this.highlightGraphicsLayer = new GraphicsLayer({
            id: 'highlight-graphics-layer',
            title: 'Highlighted Buildings',
          });
          this.map.add(this.highlightGraphicsLayer);
        }

        // Add graphics for each filtered building with flashing effect
        result.features.forEach((feature) => {
          if (feature.geometry) {
            const graphic = new Graphic({
              geometry: feature.geometry,
              symbol: new SimpleFillSymbol({
                style: 'solid',
                color: [255, 255, 0, 0.5], // Yellow with transparency
                outline: {
                  color: [255, 0, 0, 1], // Red outline
                  width: 3,
                },
              }),
            });
            this.highlightGraphicsLayer!.add(graphic);
          }
        });

        // Create flashing animation
        this.startFlashingAnimation();

        console.log(`Highlighted ${result.features.length} filtered buildings`);
      }
    } catch (error) {
      console.error('Error flashing filtered buildings:', error);
    }
  }

  /**
   * Start flashing animation for highlighted buildings
   */
  private startFlashingAnimation(): void {
    if (!this.highlightGraphicsLayer || !this.mapView) {
      return;
    }

    // Clear previous animation if exists
    if (this.highlightHandle) {
      clearInterval(this.highlightHandle);
    }

    let isVisible = true;
    let flashCount = 0;
    const maxFlashes = 6; // Flash 6 times

    this.highlightHandle = setInterval(() => {
      if (this.highlightGraphicsLayer) {
        this.highlightGraphicsLayer.visible = isVisible;
        isVisible = !isVisible;
        flashCount++;

        if (flashCount >= maxFlashes * 2) {
          // Keep graphics visible after flashing
          this.highlightGraphicsLayer.visible = true;
          clearInterval(this.highlightHandle);
          this.highlightHandle = null;
        }
      }
    }, 300); // Flash every 300ms
  }

  /**
   * Clear highlight graphics
   */
  private clearHighlightGraphics(): void {
    // Stop flashing animation
    if (this.highlightHandle) {
      clearInterval(this.highlightHandle);
      this.highlightHandle = null;
    }

    // Clear graphics layer
    if (this.highlightGraphicsLayer) {
      this.highlightGraphicsLayer.removeAll();
      this.highlightGraphicsLayer.visible = false;
    }
  }

  /**
   * Highlight a point feature on the map
   */
  private async highlightPointFeature(
    feature: __esri.Graphic,
    point: __esri.Point
  ): Promise<void> {
    if (!this.map || !this.mapView) {
      return;
    }

    try {
      // Create or get highlight graphics layer
      if (!this.highlightGraphicsLayer) {
        this.highlightGraphicsLayer = new GraphicsLayer({
          id: 'highlight-graphics-layer',
          title: 'Highlighted Features',
        });
        this.map.add(this.highlightGraphicsLayer);
      }

      // Clear previous highlights
      this.highlightGraphicsLayer.removeAll();

      // Create a highlighted graphic for the point
      const highlightGraphic = new Graphic({
        geometry: point,
        symbol: new SimpleMarkerSymbol({
          style: 'circle',
          size: 20,
          color: [255, 0, 0, 1], // Red color
          outline: {
            color: [255, 255, 255, 1], // White outline
            width: 3,
          },
        }),
      });

      this.highlightGraphicsLayer.add(highlightGraphic);
      this.highlightGraphicsLayer.visible = true;

      console.log('Point feature highlighted');
    } catch (error) {
      console.error('Error highlighting point feature:', error);
    }
  }

  /**
   * Clear all layer filters and reset map view to default
   */
  async clearLayerFilterAndResetView(layerId?: string): Promise<void> {
    this.clearLayerFilter(layerId);
    await this.goHome();
  }

  /**
   * Filter layers by code values with cascading logic
   * @param filters Object containing filter code values { slaughterhouseCode, buildingCode, floorName, roomCode, roomName }
   * Note: floorName is the English floor name (e.g., 'Ground Floor', 'First Floor', 'Second Floor')
   * Note: roomCode is used for rooms layer filtering, roomName is used for assets layer filtering
   *
   * Cascading logic:
   * - When site selected → filter ALL layers by site code
   * - When building selected → filter all EXCEPT slaughterhouse by building code
   * - When floor selected → filter all EXCEPT slaughterhouse and building by floor name
   * - When room selected → filter all EXCEPT slaughterhouse, building, and floor by room code (rooms layer) and room name (assets layer)
   */
  async filterAssetLayer(filters: {
    slaughterhouseCode?: string;
    buildingCode?: string;
    floorName?: string; // English floor name, not code
    roomCode?: string; // For rooms layer filtering
    roomName?: string; // For assets layer filtering
  }): Promise<void> {
    const assetsLayerId = 'assets-point-layer';
    const roomsLayerId = 'rooms-layer';
    const buildingsLayerId = 'buildings-layer';
    const slaughterhouseLayerId = 'slaughterhouse-layer';

    const assetsLayer = this.layers.get(assetsLayerId) as FeatureLayer;
    const roomsLayer = this.layers.get(roomsLayerId) as FeatureLayer;
    const buildingsLayer = this.layers.get(buildingsLayerId) as FeatureLayer;
    const slaughterhouseLayer = this.layers.get(
      slaughterhouseLayerId
    ) as FeatureLayer;

    if (!this.mapView) {
      console.error('Map view not initialized');
      return;
    }

    try {
      // Helper function to escape single quotes for SQL
      const escapeValue = (value: string): string => {
        return value.replace(/'/g, "''");
      };

      // ============================================
      // FILTER SLAUGHTERHOUSE LAYER
      // Only filtered when site (slaughterhouse) is selected
      // ============================================
      if (slaughterhouseLayer) {
        if (filters.slaughterhouseCode) {
          const escaped = escapeValue(filters.slaughterhouseCode);
          slaughterhouseLayer.definitionExpression = `Code = '${escaped}'`;
          console.log(
            'Filtering slaughterhouse layer by Code:',
            filters.slaughterhouseCode
          );
        } else {
          slaughterhouseLayer.definitionExpression = '';
          console.log('Clearing slaughterhouse layer filter');
        }
      }

      // ============================================
      // FILTER BUILDINGS LAYER
      // Filtered by site code (if selected) and building code (if selected)
      // ============================================
      if (buildingsLayer) {
        const buildingsWhereConditions: string[] = [];

        if (filters.slaughterhouseCode) {
          const escaped = escapeValue(filters.slaughterhouseCode);
          buildingsWhereConditions.push(`SlaughterhouseCode = '${escaped}'`);
        }

        if (filters.buildingCode) {
          const escaped = escapeValue(filters.buildingCode);
          buildingsWhereConditions.push(`code = '${escaped}'`);
        }

        const buildingsWhereClause =
          buildingsWhereConditions.length > 0
            ? buildingsWhereConditions.join(' AND ')
            : '1=1';

        buildingsLayer.definitionExpression = buildingsWhereClause;
        console.log('Applying buildings filter:', buildingsWhereClause);
      }

      // ============================================
      // FILTER ROOMS LAYER
      // Filtered by site code (if selected), building code (if selected), floor code (if selected), room code (if selected)
      // ============================================
      if (roomsLayer) {
        const roomsWhereConditions: string[] = [];

        if (filters.slaughterhouseCode) {
          const escaped = escapeValue(filters.slaughterhouseCode);
          roomsWhereConditions.push(`SlaughterhouseCode = '${escaped}'`);
        }

        if (filters.buildingCode) {
          const escaped = escapeValue(filters.buildingCode);
          roomsWhereConditions.push(`BuildCode = '${escaped}'`);
        }

        if (filters.floorName) {
          const escaped = escapeValue(filters.floorName);
          // Use LevelRoom field for floor filtering (English name: 'Ground Floor', 'First Floor', 'Second Floor')
          roomsWhereConditions.push(`LevelRoom = '${escaped}'`);
        }

        if (filters.roomCode) {
          const escaped = escapeValue(filters.roomCode);
          // Use CodeRoom1 field for filtering
          roomsWhereConditions.push(`CodeRoom1 = '${escaped}'`);
        }

        const roomsWhereClause =
          roomsWhereConditions.length > 0
            ? roomsWhereConditions.join(' AND ')
            : '1=1';

        roomsLayer.definitionExpression = roomsWhereClause;
        console.log('Applying rooms filter:', roomsWhereClause);
      }

      // ============================================
      // FILTER ASSETS (POINTS) LAYER
      // Filtered by site code (if selected), building code (if selected), floor code (if selected), room code (if selected)
      // ============================================
      if (assetsLayer) {
        const assetsWhereConditions: string[] = [];

        if (filters.slaughterhouseCode) {
          const escaped = escapeValue(filters.slaughterhouseCode);
          assetsWhereConditions.push(`SlaughterhouseCode = '${escaped}'`);
        }

        if (filters.buildingCode) {
          const escaped = escapeValue(filters.buildingCode);
          assetsWhereConditions.push(`BuildCode = '${escaped}'`);
        }

        if (filters.floorName) {
          const escaped = escapeValue(filters.floorName);
          // Use LevelAsset field for floor filtering (English name: 'Ground Floor', 'First Floor', 'Second Floor')
          assetsWhereConditions.push(`LevelAsset = '${escaped}'`);
        }

        if (filters.roomName) {
          const escaped = escapeValue(filters.roomName);
          // Use RoomName field for room filtering in assets layer
          assetsWhereConditions.push(`RoomName = '${escaped}'`);
        }

        const assetsWhereClause =
          assetsWhereConditions.length > 0
            ? assetsWhereConditions.join(' AND ')
            : '1=1';

        assetsLayer.definitionExpression = assetsWhereClause;
        console.log('Applying assets filter:', assetsWhereClause);
      }

      // ============================================
      // ZOOM TO FILTERED FEATURES
      // Priority: Zoom to rooms layer extent if filtered, otherwise use combined extent
      // ============================================
      const hasAnyFilter =
        filters.slaughterhouseCode ||
        filters.buildingCode ||
        filters.floorName ||
        filters.roomCode ||
        filters.roomName;

      if (hasAnyFilter) {
        // Priority 1: Zoom to rooms layer extent if it has a filter
        if (
          roomsLayer &&
          roomsLayer.definitionExpression &&
          roomsLayer.definitionExpression !== '1=1'
        ) {
          try {
            const roomsQuery = roomsLayer.createQuery();
            roomsQuery.where = roomsLayer.definitionExpression;
            const roomsResult = await roomsLayer.queryExtent(roomsQuery);

            if (roomsResult && roomsResult.extent) {
              await this.mapView.goTo({
                target: roomsResult.extent.expand(1.5),
                duration: 1000,
              });
              console.log('Zoomed to rooms layer extent');
              return; // Exit early since we've zoomed to rooms layer
            }
          } catch (error) {
            console.warn('Error querying rooms layer extent:', error);
            // Fall through to combined extent logic
          }
        }

        // Priority 2: Fallback to combined extent of all filtered layers
        const extents: __esri.Extent[] = [];

        // Query assets layer extent
        if (
          assetsLayer &&
          assetsLayer.definitionExpression &&
          assetsLayer.definitionExpression !== '1=1'
        ) {
          try {
            const assetsQuery = assetsLayer.createQuery();
            assetsQuery.where = assetsLayer.definitionExpression;
            const assetsResult = await assetsLayer.queryExtent(assetsQuery);
            if (assetsResult && assetsResult.extent) {
              extents.push(assetsResult.extent);
            }
          } catch (error) {
            console.warn('Error querying assets layer extent:', error);
          }
        }

        // Query buildings layer extent
        if (
          buildingsLayer &&
          buildingsLayer.definitionExpression &&
          buildingsLayer.definitionExpression !== '1=1'
        ) {
          try {
            const buildingsQuery = buildingsLayer.createQuery();
            buildingsQuery.where = buildingsLayer.definitionExpression;
            const buildingsResult = await buildingsLayer.queryExtent(
              buildingsQuery
            );
            if (buildingsResult && buildingsResult.extent) {
              extents.push(buildingsResult.extent);
            }
          } catch (error) {
            console.warn('Error querying buildings layer extent:', error);
          }
        }

        // Query slaughterhouse layer extent
        if (
          slaughterhouseLayer &&
          slaughterhouseLayer.definitionExpression &&
          slaughterhouseLayer.definitionExpression !== '1=1'
        ) {
          try {
            const slaughterhouseQuery = slaughterhouseLayer.createQuery();
            slaughterhouseQuery.where =
              slaughterhouseLayer.definitionExpression;
            const slaughterhouseResult = await slaughterhouseLayer.queryExtent(
              slaughterhouseQuery
            );
            if (slaughterhouseResult && slaughterhouseResult.extent) {
              extents.push(slaughterhouseResult.extent);
            }
          } catch (error) {
            console.warn('Error querying slaughterhouse layer extent:', error);
          }
        }

        // If we have any extents, zoom to the union
        if (extents.length > 0) {
          let combinedExtent = extents[0];
          for (let i = 1; i < extents.length; i++) {
            combinedExtent = combinedExtent.union(extents[i]);
          }

          await this.mapView.goTo({
            target: combinedExtent.expand(1.5),
            duration: 1000,
          });

          console.log('Zoomed to combined filtered features extent');
        } else {
          console.warn('No features found matching the filter criteria');
        }
      }
    } catch (error) {
      console.error('Error filtering layers:', error);
    }
  }

  /**
   * Filter and zoom to a specific asset by ID and show popup
   * @param assetId The asset ID (AssetCode field in the layer)
   */
  async filterAndZoomToAsset(assetId: string | number): Promise<void> {
    const assetsLayerId = 'assets-point-layer';
    const assetsLayer = this.layers.get(assetsLayerId) as FeatureLayer;

    if (!assetsLayer || !this.mapView) {
      console.error('Assets layer or map view not initialized');
      return;
    }

    try {
      // Escape single quotes in assetId for SQL injection protection
      const escapedAssetId = String(assetId).replace(/'/g, "''");

      // Create query to find the asset by AssetCode
      const query = assetsLayer.createQuery();
      query.where = `AssetCode = '0${escapedAssetId}'`;
      query.returnGeometry = true;
      query.outFields = ['*'];

      const result = await assetsLayer.queryFeatures(query);
      console.log('Query result:', result);

      if (result.features && result.features.length > 0) {
        const feature = result.features[0];
        console.log('Feature found:', feature);
        console.log('Feature geometry:', feature.geometry);
        console.log('Feature geometry type:', feature.geometry?.type);

        if (feature.geometry) {
          const geometry = feature.geometry;

          // For point features, zoom directly to the point
          if (geometry.type === 'point') {
            const point = geometry as __esri.Point;
            console.log('Point coordinates - x:', point.x, 'y:', point.y);
            console.log(
              'Point longitude:',
              point.longitude,
              'latitude:',
              point.latitude
            );

            // Clear any previous highlights
            this.clearHighlightGraphics();

            // Use the point geometry directly - ArcGIS will handle coordinate system conversion
            // This works for both geographic (lon/lat) and projected (x/y) coordinates
            await this.mapView.goTo({
              target: point,
              zoom: 18,
              duration: 1000,
            });

            console.log('Zoomed to point');

            // Wait for zoom to complete, then highlight and show popup
            setTimeout(async () => {
              // Highlight the point feature
              await this.highlightPointFeature(feature, point);

              // Ensure the feature has a reference to its source layer for popup
              if (!feature.layer) {
                feature.layer = assetsLayer;
              }

              // Show popup for the feature
              try {
                // Ensure popup is enabled
                this.mapView.popupEnabled = true;

                // Open popup with the feature
                this.mapView.popup.open({
                  features: [feature],
                  location: point,
                  updateLocationEnabled: true,
                });

                console.log('Popup opened for point feature');
                console.log('Popup features:', this.mapView.popup.features);
                console.log('Popup visible:', this.mapView.popup.visible);
                console.log('Popup location:', this.mapView.popup.location);
              } catch (popupError) {
                console.error('Error opening popup:', popupError);
                // Try alternative: manually set popup properties
                try {
                  this.mapView.popup.features = [feature];
                  this.mapView.popup.location = point;
                  this.mapView.popup.visible = true;
                  console.log('Popup opened using alternative method');
                } catch (altError) {
                  console.error(
                    'Alternative popup method also failed:',
                    altError
                  );
                }
              }
            }, 1000);
          } else {
            // For other geometry types, use extent
            let extent: __esri.Extent | null = null;

            if (geometry.extent) {
              extent = geometry.extent;
            } else if ('extent' in geometry) {
              extent = (geometry as any).extent;
            }

            if (extent) {
              // Zoom to the extent
              await this.mapView.goTo({
                target: extent.expand(1.5),
                duration: 1000,
              });

              // Show popup for the feature
              setTimeout(() => {
                this.mapView.popup.open({
                  features: [feature],
                  location: geometry as any,
                });
                console.log('Popup opened for non-point feature');
              }, 500);
            } else {
              // Fallback: try to zoom to geometry directly
              await this.mapView.goTo({
                target: geometry as any,
                zoom: 18,
                duration: 1000,
              });

              setTimeout(() => {
                this.mapView.popup.open({
                  features: [feature],
                  location: geometry as any,
                });
                console.log('Popup opened (fallback)');
              }, 500);
            }
          }

          console.log(
            'Successfully zoomed to and showed popup for asset:',
            assetId
          );
        } else {
          console.warn('Feature has no geometry');
        }
      } else {
        console.warn(`No asset found with AssetCode: ${assetId}`);
      }
    } catch (error) {
      console.error('Error filtering and zooming to asset:', error);
    }
  }
}
