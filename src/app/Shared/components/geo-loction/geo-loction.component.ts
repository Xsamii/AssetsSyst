import { Component, EventEmitter, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-draw';
@Component({
  selector: 'app-geo-loction',
  templateUrl: './geo-loction.component.html',
  styleUrls: ['./geo-loction.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GeoLoctionComponent implements AfterViewInit, OnDestroy {
  @Input() initialLat?: string;
  @Input() initialLng?: string;
  @Output() locationSelected = new EventEmitter<{ lat: string; lng: string }>();
  @Output() cancel = new EventEmitter<void>();

  private map?: L.Map;
  private polygonPoints: L.LatLng[] = [];
  private markers: (L.Marker | L.CircleMarker)[] = [];
  private polygonLayer?: L.Polygon;
  private selectedMarker?: L.Marker;
  selectedLocation?: { lat: string; lng: string };
  private mapInitialized = false;

  ngAfterViewInit() {
    // Delay initialization to ensure DOM is ready
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  ngOnDestroy() {
    // Clean up map instance
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.mapInitialized = false;
    }
  }

  private initMap(): void {
    const mapElement = document.getElementById('map');

    if (this.mapInitialized) {
      return;
    }

    if (!mapElement) {
      console.error('Map element not found in DOM');
      return;
    }

    try {
      // Fix default marker icon issue with Leaflet + Webpack/Angular
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Determine initial center: use provided coordinates or default
      const initialCenter: [number, number] =
        this.initialLat && this.initialLng
          ? [parseFloat(this.initialLat), parseFloat(this.initialLng)]
          : [21.4, 39.8]; // default center (Bahrah)

      this.map = L.map('map', {
        center: initialCenter,
        zoom: 13,
      });

      // OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);

      // If initial coordinates are provided, add marker and set selected location
      if (this.initialLat && this.initialLng) {
        const initialLatLng = L.latLng(parseFloat(this.initialLat), parseFloat(this.initialLng));
        this.selectLocation(initialLatLng);
      }

      // ✅ Click Event for Location Selection
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.selectLocation(e.latlng);
      });

      // ✅ Right Click Event for Custom Drawing (keeping for backward compatibility)
      this.map.on('contextmenu', (e: L.LeafletMouseEvent) => {
        this.addPoint(e.latlng);
      });

      this.mapInitialized = true;

      // Force map to invalidate size after initialization
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 300);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private selectLocation(latlng: L.LatLng): void {
    if (!this.map) return;

    // Remove previous selected marker if exists
    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }

    // Add new marker at selected location using default Leaflet icon
    this.selectedMarker = L.marker(latlng).addTo(this.map);

    // Store selected location
    this.selectedLocation = {
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6)
    };
  }

  private addPoint(latlng: L.LatLng): void {
    if (!this.map) return;

    this.polygonPoints.push(latlng);

    // Add marker
    const marker = L.circleMarker(latlng, {
      radius: 5,
      color: '#00ffff',
      fillColor: '#00ffff',
      fillOpacity: 1,
    }).addTo(this.map);
    this.markers.push(marker);

    // Redraw polygon
    this.drawPolygon();
  }

  private drawPolygon(): void {
    if (!this.map) return;

    if (this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
    }

    if (this.polygonPoints.length >= 2) {
      this.polygonLayer = L.polygon(this.polygonPoints, {
        color: '#00ffff',
        weight: 2,
        fillOpacity: 0.3,
      }).addTo(this.map);
    }
  }


  reset(): void {
    if (!this.map) return;

    this.polygonPoints = [];
    this.markers.forEach((m) => this.map!.removeLayer(m));
    this.markers = [];

    if (this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
      this.polygonLayer = undefined;
    }

    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
      this.selectedMarker = undefined;
    }

    this.selectedLocation = undefined;
  }

  confirmLocation(): void {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
