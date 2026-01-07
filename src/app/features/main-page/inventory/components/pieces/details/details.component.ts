import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { PiecesService } from '../../services/pieces.service';
import { File } from 'src/app/Shared/models/files';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ListComponent, CommonModule, BreadCrumbComponent, UploadFileComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
 PieceDetails: any[] = [];
  requestHistory: any[] = [];
  values: any = [];
  logValues: any;
  pieceId: number;
   uploadedFiles: File[] = [];
  currentItemData: any;
  activeTab : 'details' | 'history' = 'details'
  toggle(tab :'details' | 'history' ){
    this.activeTab = tab
  }

  cols: any[] = [];
  constructor(
    private _PiecesService: PiecesService,
    private _activaRoute: ActivatedRoute,
    private _router: Router
  ) {}

  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  getPieceById() {
    this._PiecesService
      .getPieceById(this.pieceId)
      .subscribe((res) => {
        this.PieceDetails = res.data;
        this.uploadedFiles= res.data.fileUploads
        this.uploadedFiles.forEach(file => {
          file.progress = 100
        })
        // this.maintenanceRequestStatusId = res?.data?.maintenanceRequestStatusId;
      });
      this.getLog()
  }

  getLog() {
    this._PiecesService.getPieceLog(this.pieceId).subscribe(res=>{
      this.values = res.data
    })
    }

    expand(item:any){
      this._PiecesService.getPieceHistoryById(item.id).subscribe(res=>{
        this.logValues = res.data
      })
    }

  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  isSearchingReasult: boolean = false;
  totalPageCount!: number;

  // getReuestHistoryByID(paganations?: any) {
  //   this._maintenanceRequestsService
  //     .getMaintenanceHistoryById(this.pieceId)

  //     .subscribe((res) => {
  //       this.values = res.data;
  //       this.requestHistory = res.data
  //     });
  // }

  mainRoute: String = '';
  ngOnInit(): void {
    this.mainRoute = this._router.url.split('/')[1];
    this._activaRoute.params.subscribe((res) => {
      this.pieceId = res['id'];
    });
    this.getPieceById();
    this.cols = [
      new listColumns({ field: 'quantity', header: 'الكمية' }),
      new listColumns({ field: 'inventoryActionTypeName', header: 'النوع' }),

      new listColumns({ field: 'createdAt', header: 'التاريخ' , isDate: true}),
      new listColumns({ field: 'createdByUserName', header: ' بواسطة'}),
    ];
  }





  clickItem(id:any){
    this.currentItemData = this.requestHistory.find(item => item.id === id )

  }
}
