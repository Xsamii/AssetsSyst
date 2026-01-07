import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { PartsService } from '../../../buildings/components/parts-requests/services/parts.service';
import { CommonModule } from '@angular/common';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { PiecesRequestsService } from '../services/pieces-requests.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-pieces-requests',
  standalone: true,
  imports: [CommonModule, ListComponent, SweetAlertMessageComponent, NoDataYetComponent, BreadCrumbComponent, ReactiveFormsModule, CalendarModule, DropdownModule],
  templateUrl: './pieces-requests.component.html',
  styleUrls: ['./pieces-requests.component.scss']
})
export class PiecesRequestsComponent {
  // -----------------------------------
     // VALUES
     // -----------------------------------
     values: any[] = [];
     cols: any[] = [];
     isSearchingReasult: boolean = false;
     totalPageCount!: number;
     searchValue!: string;
     showBreadcrumb: boolean = true;
     showFilterPopup: boolean = false;
     filterDataParams = new FilterDataParams();
     showReciveRequest: boolean = false;
     showAddRequestNotes: boolean = false;
     showCustomizePreview: boolean = false;
     isParts:boolean = true;
     appovelVisible: boolean = false;
     approveSuccess: boolean = false;
     approveErrorVisible:boolean = false;
     approveErrorMassage:string;
     parts:any

     // userRole = +localStorage.getItem('maintainanceRole')
     alertConfirm: boolean = false;



     constructor(
      private _router: Router,
          private _activatedRoute: ActivatedRoute,
          private _fb: FormBuilder,
          private _PartsRequestsService:PartsService,
          private sharedServices:SharedService
     ) {}
     // --------------------------------------------
   // GET ALL Parts Request
   // --------------------------------------------
   getAllPartsRequest(paganations?: any) {

     this._PartsRequestsService
       .getAllPartsRequest(paganations, this.filterDataParams)
       .subscribe((data) => {
         this.values = data.data.items.reverse();

          if (
          this.isSearchingReasult == true ||
            (this.isSearchingReasult == false && this.values.length != 0)
      ) {
           this.showBreadcrumb = true;
          } else {
          this.showBreadcrumb = false;
       }
         this.totalPageCount = data.data.totalCount;
       });
   }

   //=================================================
   // FILTERS BY TEXT
   //=================================================
   filterBySearchText(value: string) {
     this.searchValue = value;
     this.isSearchingReasult = true;
     this.filterDataParams!.searchTerm = value;
     this.getAllPartsRequest();
   }
   //=================================================
   // FILTERS POPUP
   //=================================================
   onShowFilterPopup() {
     this.showFilterPopup = true;
   }
   filterForm = this._fb.group({

     StatusId: [],
     CreatedAt:[]
   });
   popupFilter() {
     this.isSearchingReasult = true;
     this.filterDataParams.filterItems = [];
     if (this.filterForm.value.StatusId)
       this.filterDataParams.filterItems.push({
         key: 'StatusId',
         operator: 'equals',
         value: this.filterForm.value.StatusId,
       });
     if (this.filterForm.value.CreatedAt)
       this.filterDataParams.filterItems.push({
         key: 'CreatedAt',
         operator: 'equals',
         value: this.filterForm.value.CreatedAt,
       });


     this.getAllPartsRequest();
     this.showFilterPopup = false;
   }
   closePopupFilter() {
     this.filterForm.reset();
     this.showFilterPopup = false;
     this.popupFilter();
   }
  // ==========================================
   // DELETE parts Request
   // ==========================================
   deleteId!: number;
   deletePartRequest(id: number) {
     this.deleteId = id;
     this.alertConfirm = true;
   }
   alertConfirmFun(value: boolean) {
     if (value) {
       this._PartsRequestsService
         .deletePart(this.deleteId)
         .subscribe((res) => {
           if (res.isSuccess) {
             this.alertConfirm = false;
             this.alertSuccessMsg =
               'تم حذف الطلب بنجاح من قائمة طلبات القطع، يمكنك المتابعة';
             this.alertSuccess = true;
             this.getAllPartsRequest();
           } else {
             this.alertConfirm = false;
             this.alertErrorMsg = res.errors[0].message;
             this.alertError = true;
           }
         });
     } else {
       this.alertConfirm = false;
     }
   }
   // ===========================================
   // Route To ADD PAGE
   // ===========================================

   routeToAddPage() {
     this._router.navigate(['buildings/parts-requests/create']);
   }
    openEdit(id) {
     this._router.navigate(['buildings/parts-requests/update', id]);
   }
   showRequest(id) {
     this._router.navigate(['buildings/parts-requests/details', id], )}

     // ------------------------------------
   // LOOKUPS
   // ------------------------------------

   partRequestsStatusLookup: any = [];
   getpartRequestsStatus() {
     this.sharedServices.getStatus().subscribe(res=>{
         this.partRequestsStatusLookup = res['data']
       });
   }

        // -----------------------------------
         // ONINIT
         // -----------------------------------
         ngOnInit(): void {
           // GET ALL
           this.getAllPartsRequest();
           // LOOKUPS
           this.getpartRequestsStatus()

           // COLUMN LIST
           this.cols = [
            new listColumns({ field: 'orderNumber', header: '#' }),
             new listColumns({ field: 'maintenanceRequestOrderNumber', header: 'رقم طلب الصيانة ' }),
             new listColumns({ field: 'createdAt', header: 'تاريخ الطلب' ,isDate:true}),

             new listColumns({
               field: 'statusName',
               header: 'حالة الطلب',
               statusPartsID:'statusId'
             }),
           ];
         }

         // ====================================
         // SWEET ALERTS
         // ====================================
         alertSuccess: boolean = false;
         alertSuccessMsg: string = '';
         alertSuccessFun(value: boolean) {
           this.alertSuccess = false;
         }
         alertError: boolean = false;
         alertErrorMsg: string = '';
         alertErrorFun(value: boolean) {
           this.alertError = false;
         }

         openAprrovelConfirem(event:any){
           this.parts = event
          this.appovelVisible =true;
         }



   submitApprove(value:any){
    if(value){
   this._PartsRequestsService.approvePart(this.parts).subscribe({
     next: (res) => {
       if(res.isSuccess){
         this.appovelVisible = false;
       this.approveSuccess = true;
       }else{
         this.appovelVisible = false;
         this.approveErrorVisible=true;
         this.approveErrorMassage = res.errors[0]['message']
       }

     },
     error: (err) => {
       console.error('Approval Error:', err);
     }
   });
    }else{
     this.appovelVisible=false
    }
   }
   approveErrorVisibleFun(value: boolean) {
     this.approveErrorVisible = false;
   }

   goToParts(value:boolean){
    if(value){
     this.approveSuccess =false
     this.getAllPartsRequest();

    }
   }
 }
