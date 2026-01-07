import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component'; 
import { MaintenanceLogService } from '../services/maintenance-log.service';

@Component({
  selector: 'app-viewmaintenance-log-for-asset',
  templateUrl: './viewmaintenance-log-for-asset.component.html',
  styleUrls: ['./viewmaintenance-log-for-asset.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    BreadCrumbComponent,
  ],
})
export class ViewmaintenanceLogForAssetComponent implements OnInit {
  
  // Component properties
  logData: any = null;
  isLoading: boolean = true;
  logId: number;
  
  // Formatted data for display
  maintenanceRequestNumber: string = '';
  processingDate: string = '';
  supervisorName: string = '';
  contractorName: string = '';
  assetNumber: string = '';
  assetType: string = '';
  notes: string = '';
  images: any[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _maintenanceLogService: MaintenanceLogService
  ) {}

  ngOnInit(): void {
    // Get ID from route parameters
    this.logId = Number(this._route.snapshot.paramMap.get('id'));
    
    if (this.logId) {
      this.loadMaintenanceLogData();
    } else {
      console.error('No log ID provided in route');
      this._router.navigate(['/buildings/assets']);
    }
  }

  loadMaintenanceLogData(): void {
    this.isLoading = true;
    
    this._maintenanceLogService.getLogById(this.logId).subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          this.logData = response.data;
          this.mapResponseToDisplayData();
          this.isLoading = false;
        } else {
          console.error('Failed to load maintenance log data');
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error loading maintenance log data:', error);
        this.isLoading = false;
      }
    );
  }

  mapResponseToDisplayData(): void {
    if (!this.logData) return;

    // Map API response to display properties
    this.maintenanceRequestNumber = this.logData.requestId ? `#${this.logData.requestId}` : 'غير متوفر';
    this.processingDate = this.logData.createdAt ? this.formatDate(this.logData.createdAt) : 'غير متوفر';
    this.supervisorName = this.logData.supervisorName || 'غير محدد';
    this.contractorName = this.logData.executableUserName || 'غير محدد';
    this.assetNumber = this.logData.assetName || 'غير متوفر';
    this.assetType = this.logData.assetTypeName || 'غير محدد';
    this.notes = this.logData.notes || 'لا توجد ملاحظات';
    
    // Process file uploads for images
    this.images = this.logData.fileUploads ? this.logData.fileUploads.map(file => ({
      id: file.id,
      url: file.fullPath,
      name: file.originalName,
      size: file.fileSize
    })) : [];
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'تاريخ غير صحيح';
    }
  }

  // Method to handle image click (optional)
  onImageClick(image: any): void {
    // You can implement image preview/modal here
    window.open(image.url, '_blank');
  }

  // Method to go back to assets list
  goBack(): void {
    this._router.navigate(['/buildings/assets']);
  }
}