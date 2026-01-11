/**
 * Configuration file for Spatial Tracking Map layers
 * This file contains all layer configurations that will be displayed on the Esri map
 */

export interface LayerConfig {
  id: string;
  name: string;
  url: string;
  type: 'feature' | 'tile' | 'imagery' | 'vector' | 'map-image' | 'graphics';
  visible: boolean;
  opacity?: number;
  minScale?: number;
  maxScale?: number;
  popupEnabled?: boolean;
  popupTemplate?: any;
  renderer?: any;
  labelingInfo?: any;
  fields?: any[];
  outFields?: string[];
  definitionExpression?: string;
  order?: number;
  legendEnabled?: boolean;
}

export interface MapConfig {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  basemap: string;
  layers: LayerConfig[];
}

/**
 * Default map configuration
 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: [39.9089722, 21.4189526],
  zoom: 16,
  basemap: 'satellite', // Satellite imagery as default
  layers: []
};

/**
 * Feature Service URL - Update this with your actual service URL
 * 
 * IMPORTANT: Replace the empty string below with your actual ArcGIS Feature Service URL
 * 
 * Example format: 'https://your-server.com/arcgis/rest/services/YourService/FeatureServer'
 * 
 * The layers will be accessed as:
 * - Layer 0 (AssetsPoint): {FEATURE_SERVICE_URL}/0
 * - Layer 1 (ROOMS): {FEATURE_SERVICE_URL}/1
 * - Layer 2 (Building2): {FEATURE_SERVICE_URL}/2
 * - Layer 3 (slaughterhouse): {FEATURE_SERVICE_URL}/3
 */
export const FEATURE_SERVICE_URL: string = 'https://144.76.146.59:6443/arcgis/rest/services/assetsMecca/newAssets/MapServer';

/**
 * Layer configurations for the Spatial Tracking Map
 * These layers are from the same feature service with different layer IDs
 */
export const SPATIAL_TRACKING_LAYERS: LayerConfig[] = [
  {
    id: 'assets-point-layer',
    name: 'نقاط الأصول (AssetsPoint)',
    url: `${FEATURE_SERVICE_URL}/0`, // Layer 0: DBO.AssetsPoint
    type: 'feature',
    visible: true,
    opacity: 1,
    popupEnabled: true,
    order: 0,
    legendEnabled: true,
    outFields: ['*'],
    popupTemplate: {
      title: 'تفاصيل الأصل',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            { fieldName: 'BuildName', label: 'اسم المبنى' },
            { fieldName: 'RoomName', label: 'اسم الغرفة' },
            { fieldName: 'slaughterhouseName', label: 'اسم المذبح' },
            { fieldName: 'main_catogry', label: 'الفئة الرئيسية' },
            { fieldName: 'sub_catogry', label: 'الفئة الفرعية' }
          ]
        }
      ]
    }
    // No renderer - will use original symbology from the service
  },
  {
    id: 'rooms-layer',
    name: 'الغرف (ROOMS)',
    url: `${FEATURE_SERVICE_URL}/1`, // Layer 1: DBO.ROOMS
    type: 'feature',
    visible: true,
    // opacity: 1,
    popupEnabled: false, // No popup for this layer
    order: 1,
    legendEnabled: true,
    outFields: ['*']
    // No renderer - will use original symbology from the service
  },
  {
    id: 'buildings-layer',
    name: 'المباني (Building2)',
    url: `${FEATURE_SERVICE_URL}/2`, // Layer 2: DBO.Building2
    type: 'feature',
    visible: true,
    // opacity: 1,
    popupEnabled: false, // No popup for this layer
    order: 2,
    legendEnabled: true,
    outFields: ['*']
    // No renderer - will use original symbology from the service
  },
  {
    id: 'slaughterhouse-layer',
    name: 'المذابح (slaughterhouse)',
    url: `${FEATURE_SERVICE_URL}/3`, // Layer 3: DBO.slaughterhouse
    type: 'feature',
    visible: true,
    // opacity: 1,
    popupEnabled: false, // No popup for this layer
    order: 3,
    legendEnabled: true,
    outFields: ['*']
    // No renderer - will use original symbology from the service
  }
];

/**
 * Basemap options available for the map
 */
export const BASEMAP_OPTIONS = [
  { id: 'arcgis-topographic', name: 'طبوغرافي' },
  { id: 'arcgis-imagery', name: 'صور جوية' },
  { id: 'arcgis-streets', name: 'شوارع' },
  { id: 'arcgis-navigation', name: 'ملاحة' },
  { id: 'arcgis-dark-gray', name: 'رمادي داكن' },
  { id: 'arcgis-light-gray', name: 'رمادي فاتح' },
  { id: 'arcgis-oceans', name: 'محيطات' },
  { id: 'arcgis-satellite', name: 'قمر صناعي' }
];

/**
 * Get layer configuration by ID
 */
export function getLayerConfigById(layerId: string): LayerConfig | undefined {
  return SPATIAL_TRACKING_LAYERS.find(layer => layer.id === layerId);
}

/**
 * Get visible layers
 */
export function getVisibleLayers(): LayerConfig[] {
  return SPATIAL_TRACKING_LAYERS.filter(layer => layer.visible);
}

/**
 * Update layer visibility
 */
export function updateLayerVisibility(layerId: string, visible: boolean): LayerConfig | undefined {
  const layer = getLayerConfigById(layerId);
  if (layer) {
    layer.visible = visible;
  }
  return layer;
}

