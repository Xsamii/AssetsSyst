import { Component, OnInit } from '@angular/core';
import { ContractorsEvaluationService } from './services/contractors-evaluation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contractors-evaluation',
  templateUrl: './contractors-evaluation.component.html',
  styleUrls: ['./contractors-evaluation.component.scss'],
})
export class ContractorsEvaluationComponent implements OnInit {
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
  filterDataParams = new FilterDataParams();
  totalCount: number;

  // Dropdown Lists
  contractorsList: any[] = [];
  buildingsList: any[] = [];

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
      this._contractorsEvaluationService.deleteContractorEvaluation(this.currentId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccessMsg =
            'تم حذف تقييم المقاول بنجاح من قائمة تقييمات المقاولين، يمكنك المتابعة';
          this.alertSuccess = true;
          this.getAllContractorsEvaluation();
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
    private _contractorsEvaluationService: ContractorsEvaluationService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL Contractors Evaluation
  // ------------------------------------
  getAllContractorsEvaluation(paganations?: any) {
    this._contractorsEvaluationService
      .getAllContractorsEvaluation(paganations, this.filterDataParams)
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
          this.showBreadcrumb = false;

        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams.searchTerm = value;
    this.getAllContractorsEvaluation();
  }

  // --------------------------------
  // FILTER BY DROPDOWNS
  // --------------------------------
  getDropDowns() {
    forkJoin({
      contractorsReq: this._sharedService.getOfficesByType(2),
      buildingsReq: this._sharedService.getAllBuilding()
    }).subscribe(
      ({
        contractorsReq,
        buildingsReq
      }) => {
        this.contractorsList = contractorsReq.data;
        this.buildingsList = buildingsReq.data;
      }
    );
  }

  filterByContractorId(contractorId: any) {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = []
    if (contractorId) {
      this.filterDataParams.filterItems.push({
        key: 'contractorId',
        operator: 'equals',
        value: String(contractorId),
      });
    }
    this.getAllContractorsEvaluation();
  }

  filterByBuildingId(buildingId: any) {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = []
    if (buildingId) {
      this.filterDataParams.filterItems.push({
        key: 'buildingId',
        operator: 'equals',
        value: String(buildingId),
      });
    }
    this.getAllContractorsEvaluation();
  }

  // --------------------------------
  // ON ADD Contractor Evaluation
  // --------------------------------
  openAdd() {
    this._router.navigate(['add'], { relativeTo: this._activatedRoute });
  }
  // --------------------------------
  // ON EDIT Contractor Evaluation
  // --------------------------------
  openEdit(id: number) {
    this._router.navigate(['edit', id], { relativeTo: this._activatedRoute });
  }
  // --------------------------------
  // DELETE Contractor Evaluation
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
    this.getAllContractorsEvaluation();
    this.getDropDowns();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'contractorName', header: 'المقاول' }),
      new listColumns({ field: 'buildingName', header: 'المبنى' }),
      new listColumns({ field: 'maintTypeName', header: 'اسم نوع الخطة' }),
      new listColumns({ field: 'periodName', header: 'المدة' }),
      // new listColumns({ field: 'description', header: 'التقييم' }),

    ];
  }
}
