import { Component, OnInit } from '@angular/core';
import { MaintenanceRequestsService } from '../../services/maintenance-requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  requestDetails: any[] = [];
  requestHistory: any[] = [];
  values: any = [];
  requestId: number;
  maintenanceRequestStatusId: number;
  currentItemData: any;
  activeTab : 'details' | 'history' = 'details'
  toggle(tab :'details' | 'history' ){
    this.activeTab = tab
  }

  cols: any[] = [];
  constructor(
    private _maintenanceRequestsService: MaintenanceRequestsService,
    private _activaRoute: ActivatedRoute,
    private _router: Router
  ) {}

  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  getRequestById() {
    this._maintenanceRequestsService
      .getMaintenanceById(this.requestId)
      .subscribe((res) => {
        this.requestDetails = res.data;
        this.maintenanceRequestStatusId = res?.data?.maintenanceRequestStatusId;
      });
  }
downloadFile(data) {
    const url = environment.filesUrl + data.filePath;
    window.open(url, '_blank');
    // saveAs(`${environment.filesUrl}` + `/${data.filePath}`, `${data.originalName}`);
    // saveAs(`${data.fullPath}`, `${data.originalName}`);
    // [href]="file?.filePath"
    //         target="_blank"
  }
  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  isSearchingReasult: boolean = false;
  totalPageCount!: number;

  getReuestHistoryByID(paganations?: any) {
    this._maintenanceRequestsService
      .getMaintenanceHistoryById(this.requestId)

      .subscribe((res) => {
        this.values = res.data;
        this.requestHistory = res.data
      });
  }

  mainRoute: String = '';
  ngOnInit(): void {
    this.mainRoute = this._router.url.split('/')[1];
    this._activaRoute.params.subscribe((res) => {
      this.requestId = res['id'];
    });
    this.getRequestById();
    this.getReuestHistoryByID();
    this.cols = [
      new listColumns({ field: 'createdByUserName', header: 'قام بالتعديل' }),
      new listColumns({ field: 'createdAt', header: 'تاريخ التعديل ' , isDate: true}),
      new listColumns({ field: 'maintenanceRequestStatusName', header: ' الحالة' ,  maintenanceRequestStatusId: 'maintenanceRequestStatusId',}),
    ];
  }





  clickItem(id:any){
    this.currentItemData = this.requestHistory.find(item => item.id === id )

  }
}
