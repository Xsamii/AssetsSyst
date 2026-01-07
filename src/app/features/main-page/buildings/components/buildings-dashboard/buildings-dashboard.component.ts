import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import {
  GoogleMapsModule,
  MapInfoWindow,
} from '@angular/google-maps';
import { DashboardMintService } from './services/dashboard.service';
import { MainBuildingsService } from '../main-buildings/services/main-buildings.service';
import { Router } from '@angular/router';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SharedService } from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-buildings-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    DropdownModule,
    BreadCrumbComponent
  ],
  templateUrl: './buildings-dashboard.component.html',
  styleUrls: ['./buildings-dashboard.component.scss'],
})
export class BuildingsDashboardComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  // Forms
  filterForm: FormGroup;

  // Map Configuration
  zoom = 12;
  hybrid = google.maps.MapTypeId.HYBRID;
  center: google.maps.LatLngLiteral = {
    lat: 21.4225,
    lng: 39.8262,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };

  // Map Data
  markerPositions: google.maps.LatLngLiteral[] = [];
  allMapData: {
    id: number | null;
    lat: number;
    long: number;
    buildingId: number;
    buildingName?: string;
  }[] = [];
  filteredMapData: {
    id: number | null;
    lat: number;
    long: number;
    buildingId: number;
    buildingName?: string;
    isGroup?: boolean;
    count?: number;
    title?: string;
    items?: any[];
  }[] = [];

  // Dropdown Options
  buildingsList: any[] = [];

  // Selected Building Data
  selectedProject: any = null;
  mainBuildingData: any;

  // Loading States
  isLoading = false;

  constructor(
    private _dashboardMintService: DashboardMintService,
    private _mainBuildingsService: MainBuildingsService,
    private sharedService: SharedService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadBuildingsList();
    this.loadMapData();
  }

  // Initialize reactive form
  initializeForm() {
    this.filterForm = this.fb.group({
      buildingId: ['']
    });
  }

  // Handle building dropdown change explicitly
  onBuildingChange(event: any) {
    const selectedBuildingId = event.value;

    // Update form control
    this.filterForm.patchValue({ buildingId: selectedBuildingId });

    // Force filtering
    this.filterMapData();
  }

  // Load buildings list for dropdown
  loadBuildingsList() {
    this.sharedService.getAllBuilding().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {

          this.buildingsList = [
            { id: '', name: 'جميع المباني' },
            ...response.data.map(building => ({
              id: building.id,
              name: building.name
            }))
          ];
        }
      },
      (error) => {
        console.error('Error loading buildings list:', error);
      }
    );
  }

  // Load map locations and group by coordinates
  loadMapData() {
    this.isLoading = true;
    this._dashboardMintService.getLocation().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {

          this.allMapData = response.data.map(item => ({
            ...item,
            buildingName: item.buildingName || `مبنى ${item.buildingId}`
          }));

          // Initial load - show all data
          this.filteredMapData = this.groupLocationsByCoordinates(this.allMapData);
          this.updateMapMarkers();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading map data:', error);
        this.isLoading = false;
      }
    );
  }

  // Group locations by coordinates to handle overlapping markers
  groupLocationsByCoordinates(locations: any[]): any[] {
    const groupedMap = new Map();

    locations.forEach(location => {
      const key = `${location.lat}_${location.long}`;

      if (groupedMap.has(key)) {
        // Add to existing group
        const existing = groupedMap.get(key);
        existing.items.push(location);
        existing.count = existing.items.length;
        // Update title to show multiple items
        existing.title = `${existing.items.length} عنصر في هذا الموقع`;
      } else {
        // Create new group
        groupedMap.set(key, {
          lat: location.lat,
          long: location.long,
          buildingId: location.buildingId,
          buildingName: location.buildingName,
          items: [location],
          count: 1,
          title: location.buildingName || `مبنى ${location.buildingId}`,
          isGroup: false
        });
      }
    });

    // Convert map to array and mark groups
    const result = Array.from(groupedMap.values()).map(group => {
      if (group.count > 1) {
        group.isGroup = true;
        // For groups, use the most common buildingId
        const buildingIds = group.items.map(item => item.buildingId);
        const mostCommonBuildingId = buildingIds.sort((a,b) =>
          buildingIds.filter(v => v === a).length - buildingIds.filter(v => v === b).length
        ).pop();
        group.buildingId = mostCommonBuildingId;
      }
      return group;
    });

    return result;
  }

  // Filter map data based on form values with grouped coordinates
  filterMapData() {
    const { buildingId } = this.filterForm.value;
    // First filter the original data
    const filteredOriginal = this.allMapData.filter(item => {
      // Filter by building ID - handle empty string and convert both to numbers for comparison
      let matchesBuilding = true;
      if (buildingId && buildingId !== '') {
        matchesBuilding = Number(item.buildingId) === Number(buildingId);
      }

      return matchesBuilding;
    });

    // Then group the filtered data by coordinates
    this.filteredMapData = this.groupLocationsByCoordinates(filteredOriginal);
    this.updateMapMarkers();
  }

  // Update map markers based on filtered data
  updateMapMarkers() {
    this.markerPositions = this.filteredMapData.map(item => ({
      lat: item.lat,
      lng: item.long
    }));
  }

  // Handle marker click
  openInfoWindow(marker: any, markerRef: any) {
    this.selectedProject = this.filteredMapData.find(
      (x) => x.lat === marker.lat && x.long === marker.lng
    );

    if (this.selectedProject && this.selectedProject.buildingId) {
      this.getBuildingById(this.selectedProject.buildingId);
    }

    if (this.infoWindow) {
      this.infoWindow.open(markerRef);
    }
  }

  // Get building details
  getBuildingById(id: any) {
    this._mainBuildingsService.getmapDetailsById(id).subscribe(
      (res) => {
        this.mainBuildingData = res.data;
      },
      (error) => {
        console.error('Error loading building data:', error);
      }
    );
  }

  // Navigate to building details
  viewBuildingDetails() {
    if (this.selectedProject && this.selectedProject.buildingId) {
      this.router.navigate(['buildings/main-buildings/edit/', this.selectedProject.buildingId]);
    }
  }

  // Reset filters
  resetFilters() {
    this.filterForm.reset({
      buildingId: ''
    });
    // Force filtering after reset
    setTimeout(() => {
      this.filterMapData();
    }, 100);
  }

  // Breadcrumb event handlers
  openAdd() {
    this.router.navigate(['buildings/main-buildings/add']);
  }

  // TrackBy function for performance optimization
  trackByPosition(index: number, item: any) {
    return `${item.lat}-${item.lng}`;
  }
}
