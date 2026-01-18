# Spatial Tracking Map - Chat Context Backup

**Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Project:** Assets Management System - Spatial Tracking Map Component

---

## Overview

This document contains the context and changes made during the development of the Spatial Tracking Map component, including filtering logic, popup configurations, layer ordering, and asset navigation features.

---

## Key Features Implemented

### 1. Code-Based Cascading Filtering
- **Location:** `spatial-tracking-map.component.ts` and `spatial-tracking-map.service.ts`
- **Description:** Implemented filtering based on `code` values instead of `name` values for Slaughterhouse, Building, and Room layers
- **Cascading Logic:**
  - When site (slaughterhouse) is selected → all layers are filtered
  - When building is selected → all layers except slaughterhouse are filtered
  - When floor is selected → all layers except slaughterhouse and building are filtered
  - When room is selected → all layers except slaughterhouse, building, and floor are filtered

### 2. Floor Name Mapping
- **Location:** `spatial-tracking-map.component.ts`
- **Method:** `mapFloorCodeToEnglishName(arabicCode: string): string`
- **Description:** Converts Arabic floor codes from API to English names for filtering:
  - `'الطابق الأرضي'` → `'Ground Floor'`
  - `'الطابق الأول'` → `'First Floor'`
  - `'الطابق الثاني'` → `'Second Floor'`
- **Usage:** Filters `LevelRoom` field in rooms layer and `LevelAsset` field in assets layer

### 3. Room Code Normalization
- **Location:** `spatial-tracking-map.component.ts`
- **Method:** `normalizeRoomCode(roomCode: string): string`
- **Description:** Pads 7-digit numeric room codes with a leading '0' to make them 8-digit strings
- **Usage:** Used for filtering rooms layer by `CodeRoom1` field

### 4. Rooms Layer Popup
- **Location:** `spatial-tracking-map.config.ts`
- **Fields Displayed:**
  - `Build_Name` (اسم المبنى)
  - `LevelRoom` (الدور)
  - `CodeRoom1` (رمز الغرفة) - **Note:** Uses `CodeRoom1` not `CodeRoom`
  - `NameRoom` (اسم الغرفة)
  - `TypeRoom` (نوع الغرفة)
  - `SlaughterhouseName` (اسم المذبح)

### 5. Assets Layer Popup Configuration
- **Location:** `spatial-tracking-map.config.ts`
- **Structure:** Two sections
  - **Section 1 - Asset Details:**
    - `ItemName` (اسم الأصل)
    - `SystemName` (النظام)
    - `main_catogry` (التصنيف الرئيسي)
    - `sub_catogry` (الفئة الفرعية)
    - Additional asset-related fields (SystemType, Material, Type, AssetCode, EquipmentNo, Manufacturer info, dimensions, weights, pressures, temperatures, etc.)
  - **Section 2 - Location:**
    - `RoomName` (الغرفة)
    - `LevelAsset` (الدور)
    - `BuildName` (المبني)
    - `slaughterhouseName` (المجزة)

### 6. Asset Navigation from List
- **Location:** 
  - `assets.component.ts` - Navigation logic
  - `spatial-tracking-map.component.ts` - Query parameter handling
  - `spatial-tracking-map.service.ts` - Filter and zoom logic
- **Flow:**
  1. User clicks "View on Map" button in assets list
  2. Component extracts `name` property (الرقم التعريفي) from selected asset
  3. Navigates to `/map` with `queryParams: { assetId: assetIdentificationNumber }`
  4. Map component reads `assetId` from query params
  5. Waits for map and layers to be fully initialized
  6. Queries assets layer by `AssetCode` field
  7. Zooms to the feature and shows popup

### 7. Zoom to Rooms Layer Extent
- **Location:** `spatial-tracking-map.service.ts` - `filterAssetLayer()` method
- **Description:** When filters are applied, the map zooms to the rooms layer extent first (if filtered), otherwise falls back to combined extent of all filtered layers
- **Priority:**
  1. Rooms layer extent (if filtered)
  2. Combined extent of all filtered layers (fallback)

### 8. Assets Layer Above All Other Layers
- **Location:** `spatial-tracking-map.service.ts` - `addConfiguredLayers()` method
- **Description:** Layers are added in reverse order so that assets layer (first in config) is added last and appears on top of all other layers

---

## File Structure

```
src/app/features/main-page/maps/spatial-tracking-map/
├── spatial-tracking-map.component.ts      # Main component with filter forms and data loading
├── spatial-tracking-map.component.html   # Template
├── spatial-tracking-map.component.scss   # Styles
├── spatial-tracking-map.config.ts        # Layer configurations and popup templates
├── layers.txt                            # Field names for each layer
└── services/
    └── spatial-tracking-map.service.ts   # ArcGIS API interactions, filtering, zooming
```

---

## Key Methods and Properties

### Component (`spatial-tracking-map.component.ts`)

**Properties:**
- `selectedSlaughterhouseCode: string | null` - Selected site code
- `selectedBuildingCode: string | null` - Selected building code
- `selectedFloorName: string | null` - Selected floor English name
- `selectedRoomCode: string | null` - Selected room code (for rooms layer)
- `selectedRoomName: string | null` - Selected room name (for assets layer)
- `pendingAssetId: string | null` - Asset ID from query params waiting to be processed
- `mapViewInitialized: boolean` - Flag for map view readiness
- `layersLoaded: boolean` - Flag for layers readiness

**Methods:**
- `mapFloorCodeToEnglishName(arabicCode: string): string` - Maps Arabic floor codes to English names
- `normalizeRoomCode(roomCode: string): string` - Normalizes room codes to 8 digits
- `checkQueryParamsForAssetId()` - Reads assetId from query params
- `checkIfReadyToProcessAssetId()` - Checks if conditions are met to process asset ID
- `processAssetIdFromQueryParams()` - Handles filtering and zooming to asset
- `applyMapFilters()` - Applies filters to map layers

### Service (`spatial-tracking-map.service.ts`)

**Methods:**
- `filterAssetLayer(filters)` - Applies cascading filters to all layers
  - Parameters: `{ slaughterhouseCode?, buildingCode?, floorName?, roomCode?, roomName? }`
  - Filters layers based on cascading logic
  - Zooms to rooms layer extent (if filtered) or combined extent
- `filterAndZoomToAsset(assetId)` - Filters and zooms to specific asset
  - Queries by `AssetCode` field
  - Zooms to point geometry
  - Highlights feature with red marker
  - Opens popup
- `addConfiguredLayers(layerConfigs)` - Adds layers in reverse order (assets on top)
- `highlightPointFeature(feature, point)` - Highlights point feature with red marker
- `clearHighlightGraphics()` - Removes previous highlights

---

## Layer Configuration

### Layer IDs and URLs
- `assets-point-layer`: `${FEATURE_SERVICE_URL}/0`
- `rooms-layer`: `${FEATURE_SERVICE_URL}/1`
- `buildings-layer`: `${FEATURE_SERVICE_URL}/2`
- `slaughterhouse-layer`: `${FEATURE_SERVICE_URL}/3`

### Filtering Fields

**Slaughterhouse Layer:**
- Filter by: `Code`

**Buildings Layer:**
- Filter by: `SlaughterhouseCode`, `code`

**Rooms Layer:**
- Filter by: `SlaughterhouseCode`, `BuildCode`, `LevelRoom` (English floor name), `CodeRoom1`

**Assets Layer:**
- Filter by: `SlaughterhouseCode`, `BuildCode`, `LevelAsset` (English floor name), `RoomName`

---

## Important Code Snippets

### Floor Name Mapping
```typescript
private mapFloorCodeToEnglishName(arabicCode: string): string {
  const floorMap: { [key: string]: string } = {
    'الطابق الأرضي': 'Ground Floor',
    'الطابق الأول': 'First Floor',
    'الطابق الثاني': 'Second Floor',
  };
  return floorMap[arabicCode] || arabicCode;
}
```

### Room Code Normalization
```typescript
private normalizeRoomCode(roomCode: string): string {
  // If the code is a 7-digit number, pad with leading '0' to make it 8 digits
  if (/^\d{7}$/.test(roomCode)) {
    return '0' + roomCode;
  }
  return roomCode;
}
```

### Asset ID Processing
```typescript
private checkIfReadyToProcessAssetId(): void {
  if (
    this.pendingAssetId &&
    this.mapViewInitialized &&
    this.layersLoaded &&
    this.mapView
  ) {
    this.processAssetIdFromQueryParams();
  }
}
```

### Filter and Zoom to Asset
```typescript
async filterAndZoomToAsset(assetId: string | number): Promise<void> {
  // Query by AssetCode
  query.where = `AssetCode = '${escapedAssetId}'`;
  
  // Zoom to point
  await this.mapView.goTo({
    target: point,
    zoom: 18,
    duration: 1000,
  });
  
  // Highlight and show popup
  await this.highlightPointFeature(feature, point);
  this.mapView.popup.open({
    features: [feature],
    location: point,
  });
}
```

### Zoom to Rooms Layer Extent
```typescript
// Priority 1: Zoom to rooms layer extent if it has a filter
if (roomsLayer && roomsLayer.definitionExpression && roomsLayer.definitionExpression !== '1=1') {
  const roomsQuery = roomsLayer.createQuery();
  roomsQuery.where = roomsLayer.definitionExpression;
  const roomsResult = await roomsLayer.queryExtent(roomsQuery);
  
  if (roomsResult && roomsResult.extent) {
    await this.mapView.goTo({
      target: roomsResult.extent.expand(1.5),
      duration: 1000,
    });
    return; // Exit early
  }
}
```

### Layer Ordering (Assets on Top)
```typescript
async addConfiguredLayers(layerConfigs: LayerConfig[]): Promise<void> {
  // Add layers in reverse order so assets layer (first in config) is added last and appears on top
  const reversedConfigs = [...layerConfigs].reverse();
  for (const layerConfig of reversedConfigs) {
    // ... add layer logic
  }
}
```

---

## Data Flow

### Filter Application Flow
1. User selects filter value in dropdown
2. Component stores code/name value
3. `applyMapFilters()` called
4. Service `filterAssetLayer()` applies filters with cascading logic
5. Map zooms to rooms layer extent (if filtered) or combined extent
6. Layers update with filtered features

### Asset Navigation Flow
1. User clicks "View on Map" in assets list
2. Component extracts asset identification number (الرقم التعريفي)
3. Navigates to `/map?assetId=...`
4. Map component reads `assetId` from query params
5. Stores in `pendingAssetId`
6. Waits for map and layers to initialize
7. Calls `filterAndZoomToAsset()`
8. Queries assets layer by `AssetCode`
9. Zooms to feature, highlights, and shows popup
10. Clears query params

---

## API Response Structure

### Slaughterhouse Response
```json
{
  "id": number,
  "name": string,
  "code": string,
  "url": string | null
}
```

### Building Response
```json
{
  "id": number,
  "name": string,
  "code": string,
  "url": string | null
}
```

### Floor Response
```json
{
  "id": number,
  "name": string,  // Arabic name
  "code": string,  // Arabic code (same as name)
  "url": string | null
}
```

### Room Response
```json
{
  "id": number,
  "name": string,
  "code": string,  // May be 7 or 8 digits
  "url": string | null
}
```

---

## Troubleshooting Notes

### Popup Not Opening
- Ensure `mapView.popupEnabled = true`
- Set `feature.layer = assetsLayer` before opening popup
- Use `popup.open()` with both `features` and `location` parameters
- Add delay after zoom to ensure animation completes

### Coordinate System Issues
- Point features may have `x`/`y` but null `longitude`/`latitude`
- Use point geometry directly in `goTo()` - ArcGIS handles coordinate conversion
- Don't rely on `longitude`/`latitude` properties for projected coordinates

### Filtering Not Working
- Verify field names match exactly (case-sensitive)
- Check SQL injection protection (escape single quotes)
- Ensure `definitionExpression` is set correctly
- Verify layer is fully loaded before querying

### Zoom Issues
- Wait for layers to be fully loaded before querying extents
- Use `queryExtent()` instead of `queryFeatures()` for better performance
- Expand extent by 1.5x for better visibility
- Handle empty extents gracefully

---

## Future Enhancements (Potential)

1. **Performance Optimization:**
   - Cache filter results
   - Debounce filter changes
   - Lazy load layer data

2. **User Experience:**
   - Show loading indicators during filtering
   - Add animation for filter changes
   - Remember last filter state

3. **Features:**
   - Export filtered data
   - Print map with current filters
   - Share map view with filters via URL

---

## Related Files

- `src/app/features/main-page/buildings/components/assets/assets.component.ts` - Assets list component
- `src/app/Shared/components/list/list.component.ts` - Generic list component
- `src/app/features/main-page/maps/spatial-tracking-map/layers.txt` - Layer field definitions

---

## Notes

- All filtering uses SQL `WHERE` clauses via `definitionExpression`
- Coordinate system conversion is handled automatically by ArcGIS
- Popup templates are defined in `spatial-tracking-map.config.ts`
- Layer visibility and ordering are managed by the service
- Query parameters are cleared after processing to avoid re-processing on navigation

---

**End of Backup Document**

