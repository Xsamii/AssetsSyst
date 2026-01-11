import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpatialTrackingMapService } from '../../services/spatial-tracking-map.service';

export interface MapControl {
  id: string;
  icon: string;
  tooltip: string;
  action: () => void;
  visible?: boolean;
}

@Component({
  selector: 'app-map-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent {
  private mapService = inject(SpatialTrackingMapService);

  @Output() layerListToggle = new EventEmitter<void>();
  @Output() baseMapToggle = new EventEmitter<void>();
  @Output() legendToggle = new EventEmitter<void>();
  @Output() infoToggle = new EventEmitter<void>();
  @Output() printRequested = new EventEmitter<void>();
  @Output() pdfExportRequested = new EventEmitter<void>();

  controls: MapControl[] = [
    {
      id: 'zoom-in',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7',
      tooltip: 'تكبير',
      action: () => this.zoomIn(),
    },
    {
      id: 'zoom-out',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6',
      tooltip: 'تصغير',
      action: () => this.zoomOut(),
    },
    {
      id: 'home',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      tooltip: 'العودة للرئيسية',
      action: () => this.goHome(),
    },
    {
      id: 'previous',
      icon: 'M15 19l-7-7 7-7',
      tooltip: 'السابق',
      action: () => this.goBackExtent(),
    },
    {
      id: 'next',
      icon: 'M9 5l7 7-7 7',
      tooltip: 'التالي',
      action: () => this.goForwardExtent(),
    },
    {
      id: 'layers',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      tooltip: 'الطبقات',
      action: () => this.toggleLayers(),
    },
    {
      id: 'basemap',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      tooltip: 'تبديل الخريطة',
      action: () => this.toggleBaseMap(),
    },
    {
      id: 'legend',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
      tooltip: 'وسيلة الإيضاح',
      action: () => this.toggleLegend(),
    },
  ];

  // Map control methods
  zoomIn(): void {
    this.mapService.zoomIn();
  }

  zoomOut(): void {
    this.mapService.zoomOut();
  }

  goHome(): void {
    this.mapService.goHome();
  }

  goBackExtent(): void {
    this.mapService.goBackExtent();
  }

  goForwardExtent(): void {
    this.mapService.goForwardExtent();
  }

  toggleLayers(): void {
    this.layerListToggle.emit();
  }

  toggleBaseMap(): void {
    this.baseMapToggle.emit();
  }

  toggleLegend(): void {
    this.legendToggle.emit();
  }

  toggleInfo(): void {
    this.infoToggle.emit();
  }

  printScreen(): void {
    this.printRequested.emit();
  }

  exportToPDF(): void {
    this.pdfExportRequested.emit();
  }

  executeControl(control: MapControl): void {
    control.action();
  }
}

