import { Component } from '@angular/core';
import { ContractorsService } from './services/contractors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.scss'],
})
export class ContractorsComponent {
  // --------------------------------
  // VALUES
  // --------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  alertConfirm: boolean = false;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';

  // --------------------------------
  // SWEET ALERTS FUNCTIONS
  // --------------------------------

  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  alertConfirmFun(value) {
    if (value) {
      this._contractorsService.deleteOffice(this.currentId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccessMsg =
            'تم حذف المقاول بنجاح من قائمة المقاولين، يمكنك المتابعة';
          this.alertSuccess = true;
          this.getAllOffices();
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
  // --------------------------------
  // CONSTRUCTOR
  // --------------------------------
  constructor(
    private _contractorsService: ContractorsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
  // ------------------------------------
  // GET ALL Contractors
  // ------------------------------------
  getAllOffices(paganations?: any) {
    this._contractorsService
      .getAllOffices(paganations, this.searchValue)
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
          this.alertErrorMsg =
            'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.getAllOffices();
  }

  // --------------------------------
  // ON ADD Contractors
  // --------------------------------
  openAdd() {
    this._router.navigate(['add'], { relativeTo: this._activatedRoute });
  }
  // --------------------------------
  // ON EDIT Contractors
  // --------------------------------
  openEdit(id: number) {
    this._router.navigate(['edit', id], { relativeTo: this._activatedRoute });
  }
  // --------------------------------
  // DELETE Contractors
  // --------------------------------
  currentId!: number;
  confirmDelete(id: number) {
    this.currentId = id;
    this.alertConfirm = true;
  }
  // --------------------------------
  // ONINIT
  // --------------------------------
  ngOnInit(): void {
    this.getAllOffices();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'name', header: 'الاسم' }),
      new listColumns({
        field: 'officeRegistrationNumber',
        header: 'رقم السجل',
      }),
    ];
  }
}
