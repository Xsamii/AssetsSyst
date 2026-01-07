import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { ProjectsService } from '../../../projects/components/projects-menu/components/services/projects.service';
import { PiecesService } from '../services/pieces.service';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { File } from 'src/app/Shared/models/files';

@Component({
  selector: 'app-pieces',
   standalone: true,
    imports: [
      BreadCrumbComponent,
      NoDataYetComponent,
      SweetAlertMessageComponent,
      ListComponent,
      CommonModule,
      ReactiveFormsModule,
      DropdownModule,
      DialogModule,
      UploadFileComponent
    ],
  templateUrl: './pieces.component.html',
  styleUrls: ['./pieces.component.scss']
})
export class PiecesComponent {
 userRole = +localStorage.getItem('maintainanceRole');
  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  cols: any[] = [];
  values: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  filterDataParams = new FilterDataParams();
  searchValue!: string;
  pieceId;
  displayDialog: boolean = false;
  displayRecieveDialog: boolean = false;
  searchForm: FormGroup;
  newQuantityForm: FormGroup;
  uploadedFiles: File[] = [];
  itemId;
  constructor(
    private _PiecesService: PiecesService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService
  ) {}
  sharedBreadcrumbProperties = {
    imageTitle: './assets/icons/projectsActive.svg',
    subTitles: [
      { name: 'الرئيسية', routerLink: '/' },
      { name: 'إدارة المشاريع', routerLink: '/projects' },
      { name: 'المشاريع ', routerLink: '/projects/projects-menu' }
    ],
    isFilte: true,
    inputPlaceholder: 'ابحث باسم المشروع...',
    buttonText: 'مشروع جديد',
    saveBtnText: 'إضافة',
    isShowFilter: this.showBreadcrumb ? false : true,
    isShowAddEdite: false,
    showAddButton: this.userRole == 1 || this.userRole == 2,
  };

  getBreadCrumbSubTitles(){
      if(this.userRole == 5){
        this.sharedBreadcrumbProperties.subTitles = [
          {name: '' , routerLink:''}
        ]
      }
  }



  ngOnInit(): void {
    this.getData();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم القطعة ' }),
      new listColumns({ field: 'code', header: 'الكود' }),
      new listColumns({
        field: 'classificationName',
        header: 'التصنيف ',
      }),
      new listColumns({ field: 'inventoryItemUnitName', header: 'وحدة القياس ' }),
      new listColumns({ field: 'quantity', header: 'الكمية ', isCurrency: true }),


    ];
  }

  openAdd() {
    this._router.navigate(['inventory/pieces/add']);
  }
  openEdit(id) {
    this._router.navigate(['inventory/pieces/edit', id]);
  }
  openView(id) {
    this._router.navigate(['inventory/pieces/details', id]);
  }
  openRecieve(id){
    this.uploadedFiles = [];
    this.initializeRecieveNewQuantityForm();
    this.displayRecieveDialog = true;
    this.itemId = id;
  }
  addNewQuantity(){
    this.displayRecieveDialog = false;
    const obj = {
      inventoryPieceId: this.itemId,
      quantity: this.newQuantityForm.value.quantity,
      description: this.newQuantityForm.value.description,
      fileUploads: this.uploadedFiles
    }
    this._PiecesService.recieveNewQuantity(obj).subscribe(res=>{
      if(res.isSuccess){
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تمت العملية بنجاح';
        this.getData();
      }else{
        this.alertError = true;
        this.alertFailureMessage = res.errors[0].message;
      }
    })
  }

  filterBySearchTesxt(value) {
    // this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }

  deleteProject(event) {
    this.pieceId = event;
    this.alertConfirm = true;
  }
  getData(paganations?: any) {
    this._PiecesService
      .getAllPieces(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          this.values = data.data.items;
          if (
            this.isSearchingReasult == true ||
            (this.isSearchingReasult == false && this.values.length != 0)
          ) {
            this.showBreadcrumb = true;
          } else {
            this.showBreadcrumb = false;
          }
          this.totalPageCount = data.data.totalCount;
        },
        (err) => {
          this.alertError = true;
        }
      );
  }
  OnSubmitData() {
    this.popupFilter();
  }
  showDialog() {
    this.displayDialog = true;
    this.initializeSearchForm();
    this.getDropDowns();

  }

  initializeSearchForm() {
    this.searchForm = this._formBuilder.group({
      classificationId: [],
      inventoryItemUnitId: [],

    });
  }
  initializeRecieveNewQuantityForm(){
    this.newQuantityForm = this._formBuilder.group({
      quantity: [],
      description: [],
      fileUploads: this._formBuilder.array([]),
    });
  }
  closeNeqQuantityDialog(){
    this.displayRecieveDialog = false;
  }



  pieceCategoryList: any[] = [];
  pieceMeasuringUnitList: any[] = [];


  getDropDowns() {
    forkJoin({
      pieceCategoryReq: this._sharedService.getAllInventoryCategories(),
      pieceMeasuringUnitReq: this._sharedService.getInventoryMeasuringUnits(),

    }).subscribe(
      ({
        pieceCategoryReq,
        pieceMeasuringUnitReq,

      }) => {
        this.pieceCategoryList = pieceCategoryReq['data'];
        this.pieceMeasuringUnitList = pieceMeasuringUnitReq['data'];

      }
    );
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.searchForm.value.classificationId)
      this.filterDataParams.filterItems.push({
        key: 'classificationId',
        operator: 'equals',
        value: String(this.searchForm.value.classificationId),
      });

    if (this.searchForm.value.inventoryItemUnitId)
      this.filterDataParams.filterItems.push({
        key: 'inventoryItemUnitId',
        operator: 'equals',
        value: String(this.searchForm.value.inventoryItemUnitId),
      });
    this.getData();
    this.displayDialog = false;
  }
  hideDialog() {
    // this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }

  // ------------------------------------
  // SWEET ALERTS
  // ------------------------------------
  // SUCCESS
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }
  // WARNING
  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
    } else {
      // this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }
  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._PiecesService.deletePiece(this.pieceId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم حذف القطعة بنجاح من قائمة القطع يمكنك المتابعة';
          this.getData();
        } else {
          this.alertConfirm = false;
          this.alertError = true;
          this.alertFailureMessage = res.errors[0].message;
        }
      });
    } else {
      this.alertConfirm = false;
    }
  }
  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
}
