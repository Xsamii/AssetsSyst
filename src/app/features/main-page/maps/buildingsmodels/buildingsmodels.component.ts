import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GeolocationDialogComponent } from 'src/app/Shared/components/geolocation-dialog/geolocation-dialog.component';
import { SharedService } from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-buildingsmodels',
  standalone: true,
  imports: [GeolocationDialogComponent, CommonModule],
  templateUrl: './buildingsmodels.component.html',
  styleUrls: ['./buildingsmodels.component.scss']
})
export class BuildingsmodelsComponent implements OnInit {
  buildingsList: any[] = [];
  buildingLayers: any[] = [];
  isLoading: boolean = true;

  // Actions for the geolocation dialog
  actions = [
    {
      title: 'طلب صيانة',
      icon: 'export',
      id: 'maintenance-request',
    },
  ];

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadBuildings();
  }

  loadBuildings(): void {
    this.isLoading = true;

    this.sharedService.getAllBuilding().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.buildingsList = response.data; 
          // Transform buildings data to layers format
          this.transformBuildingsToLayers();
        } else {
          console.error('Failed to load buildings:', response.errors);
          this.buildingLayers = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading buildings:', error);
        this.buildingLayers = [];
        this.isLoading = false;
      }
    );
  }

  // Transform buildings data to layers format for geolocation dialog
  private transformBuildingsToLayers(): void {
    this.buildingLayers = this.buildingsList
      .filter(building => building.url) // Only include buildings that have a URL
      .map(building => ({
        title: building.name || `مبنى ${building.id}`,
        url: building.url,
        buildingId: building.id, // Keep reference to original building
        buildingCode: building.code
      }));

  }

  // Handle 3D object click events
  on3dObjectClick(eventData: any): void {
    // You can handle the click event here
    // For example, show building details or trigger maintenance request
  }

  // Handle action button clicks
  onActionClick(actionId: string): void {

    switch (actionId) {
      case 'maintenance-request':
        // Handle maintenance request action
        this.handleMaintenanceRequest();
        break;
      default:
    }
  }

  private handleMaintenanceRequest(): void {
    // Implement your maintenance request logic here
    // You could navigate to maintenance form or open a modal
  }
}
