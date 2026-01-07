import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import {
  GoogleMapsModule,
  MapInfoWindow,
} from '@angular/google-maps';
import { Router } from '@angular/router';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { MaintenanceRequestsService } from '../maintenance-requests/services/maintenance-requests.service';

@Component({
  selector: 'app-maintenance-map',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    DropdownModule,
    BreadCrumbComponent
  ],
  templateUrl: './maintenance-map.component.html',
  styleUrls: ['./maintenance-map.component.scss'],
})
export class MaintenanceMapComponent implements OnInit {
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

  // Map options to hide POIs and other default markers
  mapOptions: google.maps.MapOptions = {
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  // Map Data
  markerPositions: any[] = [];
  allMapData: any[] = [];
  filteredMapData: any[] = [];

  // Filter params
  filterDataParams = new FilterDataParams();

  // Dropdown Options
  buildingsList: any[] = [];
  statusList: any[] = [
    { id: '', name: 'جميع الحالات' },
    { id: 1, name: 'تحت المراجعة', color: '#ff9500' },
    { id: 2, name: 'تم المراجعة', color: '#1aaa55' },
    { id: 3, name: 'قيد التنفيذ', color: '#24c0db' },
    { id: 4, name: 'تحت الاستلام', color: '#e7c40c' },
    { id: 5, name: 'تم التخصيص', color: '#bc79f1' },
    { id: 6, name: 'تم رفض المعالجة', color: '#707070' },
    { id: 7, name: 'تم تأكيد الرفض', color: '#fd612f' },
    { id: 8, name: 'تم قبول المعالجة', color: '#f64fe6' },
    { id: 9, name: 'تم تأكيد المعالجة', color: '#7fd32a' },
  ];
  priorityList: any[] = [
    { id: '', name: 'جميع الأولويات' },
    { id: 1, name: 'عادي' },
    { id: 2, name: 'متوسط' },
    { id: 3, name: 'عاجل' },
  ];
  subCategoryTypesList: any[] = [];

  // Selected Request Data
  selectedRequest: any = null;

  // Loading States
  isLoading = false;

  // Status colors mapping
  statusColors: { [key: number]: string } = {
    1: '#ff9500',  // تحت المراجعة - Orange
    2: '#1aaa55',  // تم المراجعة - Green
    3: '#24c0db',  // قيد التنفيذ - Cyan
    4: '#e7c40c',  // تحت الاستلام - Yellow
    5: '#bc79f1',  // تم التخصيص - Purple
    6: '#707070',  // تم رفض المعالجة - Gray
    7: '#fd612f',  // تم تأكيد الرفض - Red
    8: '#f64fe6',  // تم قبول المعالجة - Pink
    9: '#7fd32a',  // تم تأكيد المعالجة - Light Green
  };

  constructor(
    private sharedService: SharedService,
    private maintenanceRequestsService: MaintenanceRequestsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadBuildingsList();
    this.loadSubCategoryTypes();
    this.loadMapData();
  }

  // Initialize reactive form
  initializeForm() {
    this.filterForm = this.fb.group({
      buildingId: [''],
      statusId: [''],
      priorityId: [''],
      subCategoryTypeId: ['']
    });
  }

  // Handle filter changes
  onFilterChange() {
    this.applyFiltersAndReload();
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

  // Load sub category types list for dropdown
  loadSubCategoryTypes() {
    this.sharedService.getAllPrimaryMaintenanceType().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.subCategoryTypesList = [
            { id: '', name: 'جميع أنواع الأعطال' },
            ...response.data.map(type => ({
              id: type.id,
              name: type.name
            }))
          ];
        }
      },
      (error) => {
        console.error('Error loading sub category types:', error);
      }
    );
  }

  // Apply filters and reload data from server
  applyFiltersAndReload() {
    // Build filter params based on form values
    this.filterDataParams.filterItems = [];

    const { buildingId, statusId, priorityId, subCategoryTypeId } = this.filterForm.value;

    if (buildingId && buildingId !== '') {
      this.filterDataParams.filterItems.push({
        key: 'buildingId',
        operator: 'equals',
        value: buildingId,
      });
    }

    if (statusId && statusId !== '') {
      this.filterDataParams.filterItems.push({
        key: 'MaintenanceRequestStatusId',
        operator: 'equals',
        value: statusId,
      });
    }

    if (priorityId && priorityId !== '') {
      this.filterDataParams.filterItems.push({
        key: 'RequestPriorety',
        operator: 'equals',
        value: priorityId,
      });
    }

    // Set main category as a property on filterDataParams (not in filterItems)
    if (subCategoryTypeId && subCategoryTypeId !== '') {
      this.filterDataParams.mainCatId = subCategoryTypeId;
    } else {
      this.filterDataParams.mainCatId = null;
    }

    // Reload data from server with filters
    this.loadMapData();
  }

  // Load map data from API
  loadMapData() {
    this.isLoading = true;

    // Fetch all maintenance requests without pagination (fetch all records)
    const pagination = {
      pageNumber: 1,
      pageSize: 10000 // Large number to get all records
    };

    this.maintenanceRequestsService.getAllMaintenanceRequest(pagination, this.filterDataParams).subscribe({
      next: (response) => {
        console.log('Map API Response:', response);

        // Check if response has items (like maintenance requests component)
        const dataArray = response.data?.items || response.data?.data || [];

        if (response.isSuccess && dataArray.length > 0) {
          // Map API response to component format
          this.allMapData = dataArray
            .filter((item: any) => item.lat && item.lng) // Only include items with coordinates
            .map((item: any) => ({
              id: item.id,
              requestNumber: item.orderNumber || `REQ-${item.id}`,
              description: item.proplemDescription || '',
              buildingId: item.buildingId,
              buildingName: item.buildingName || '',
              statusId: item.maintenanceRequestStatusId,
              statusName: item.maintenanceRequestStatusName || '',
              priorityId: item.requestPriorety,
              priorityName: item.maintenanceRequestPriorityName || '',
              subCategoryTypeId: item.subCategoryType,
              subCategoryTypeName: item.subCategoryTypeName || '',
              mainCategoryTypeName: item.mainCategoryTypeName || '',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lng),
              createdDate: item.createdAt,
              floorNumber: item.floorNumber || '',
              officeName: item.officeName || ''
            }));

          // Update map center to first location if available
          if (this.allMapData.length > 0) {
            this.center = {
              lat: this.allMapData[0].lat,
              lng: this.allMapData[0].lng
            };
          }

          // Filtered data is returned from server, no need for client-side filtering
          this.filteredMapData = [...this.allMapData];
          this.updateMapMarkers();

          console.log('Filtered map data count:', this.filteredMapData.length);
          console.log('Marker positions count:', this.markerPositions.length);
        } else {
          console.log('No data or empty array received from API');
          this.allMapData = [];
          this.filteredMapData = [];
          this.markerPositions = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading map data:', error);
        this.allMapData = [];
        this.filteredMapData = [];
        this.isLoading = false;
      }
    });
  }

  // Update map markers based on filtered data
  updateMapMarkers() {
    this.markerPositions = this.filteredMapData.map(item => ({
      lat: item.lat,
      lng: item.lng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: this.statusColors[item.statusId] || '#ff9500',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      requestData: item
    }));
  }

  // Handle marker click
  openInfoWindow(marker: any, markerRef: any) {
    this.selectedRequest = marker.requestData;

    if (this.infoWindow) {
      this.infoWindow.open(markerRef);
    }
  }

  // Navigate to request details
  viewRequestDetails() {
    if (this.selectedRequest && this.selectedRequest.id) {
      this.router.navigate(['maintenance/maintenace-requests/edit/', this.selectedRequest.id]);
    }
  }

  // Reset filters
  resetFilters() {
    this.filterForm.reset({
      buildingId: '',
      statusId: '',
      priorityId: '',
      subCategoryTypeId: ''
    });
    this.filterDataParams.filterItems = [];
    this.filterDataParams.mainCatId = null;
    this.loadMapData();
  }

  // TrackBy function for performance optimization
  trackByPosition(index: number, item: any) {
    return `${item.lat}-${item.lng}`;
  }

  // Get status color
  getStatusColor(statusId: number): string {
    return this.statusColors[statusId] || '#ff9500';
  }
}
