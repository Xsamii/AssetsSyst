import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Shared/services/shared.service';

@Component({
  selector: 'app-fillter-maintenance',
  templateUrl: './fillter-maintenance.component.html',
  styleUrls: ['./fillter-maintenance.component.scss']
})
export class FillterMaintenanceComponent {

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  builldingLookup: any = [];
  buildingSubUnitLookup: any = [];
  visitRequestsStatusLookup: any = [];
  requestPrioretyLookup: any = [];
  primaryMaintenanceTypeLookup: any = [];
  secondaryMaintenanceTypeLookup: any = [];
   constructor(
      private _sharedService: SharedService,
      private _fb: FormBuilder,
      private router:Router

    ) {}
    ngOnInit(): void {

          // LOOKUPS
          this.getAllBuildingLookup();
          this.getVisitRequestsStatus();
          this.getRequestPriorety();
          this.getAllPrimaryMaintenanceType();

        }

        getAllBuildingLookup() {
          this._sharedService.getAllBuilding().subscribe((res) => {
            this.builldingLookup = res.data;
          });
        }
        getAllBuildingSubUnit(id: number) {
          this._sharedService.getAllBuildingSubUnit(id).subscribe((res) => {
            this.buildingSubUnitLookup = res.data;
          });
        }
        getVisitRequestsStatus() {
          this._sharedService.getVisitRequestsStatus().subscribe(res=>{
              this.visitRequestsStatusLookup = res['data']
            });
        }
        getRequestPriorety() {
          this.requestPrioretyLookup = this._sharedService.getRequestPriorety();
        }
        getAllPrimaryMaintenanceType() {
          this._sharedService.getAllPrimaryMaintenanceType().subscribe((res) => {
            this.primaryMaintenanceTypeLookup = res.data;
          });
        }
        getMaintTypesByParent(id: number) {
          this._sharedService.getMaintTypesByParent(id).subscribe((res) => {
            this.secondaryMaintenanceTypeLookup = res.data;
          });
        }

        filterForm = this._fb.group({
          buildingId: [],
          subUnitId: [],
          mainCategoryType: [],
          // subCategoryType: [],
          maintenanceRequestStatusId: [],
          requestPriorety: [],
        });
  Filter() {
    this.router.navigate(['maintenance-report'], {
      queryParams:   this.filterForm.value
    });  }
  closeFilter() {
    this.filterForm.reset();
  }
}
