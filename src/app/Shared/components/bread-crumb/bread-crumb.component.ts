import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bread-crumb',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownModule, FormsModule],
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss'],
})
export class BreadCrumbComponent {
  @Input() imageTitle: string = '';
  @Input() title: string = '';
  @Input() subTitles: any = [];
  @Input() isFilte: boolean = false;
  @Input() inputPlaceholder: string = '';
  @Input() buttonText: string = '';
  @Input() isShowFilter: boolean = true;
  @Input() showInPutSearch: boolean = true;
  @Input() isShowAddEdite: boolean = false;
  @Input() saveBtnText: string = '';
  @Input() showAddButton: boolean = true;
  @Output() addButton = new EventEmitter();
  @Output() valueSearch = new EventEmitter();
  @Output() onFilterClick = new EventEmitter();
  @Output() submitReq = new EventEmitter();
  @Output() cancelReq = new EventEmitter();
  @Input() projectStatusList: any[] = [];
  @Input() OfficesList: any[] = [];
  @Input() AssetTypeList: any[] = [];
  @Input() maintabList: any[] = [];

  // Contractors Evaluation Dropdowns
  @Input() contractorsList: any[] = [];
  @Input() buildingsList: any[] = [];
  @Input() planTypesList: any[] = [];

  // Evaluation Settings Dropdowns
  @Input() durationsList: any[] = [];
  @Input() planTypesListSettings: any[] = [];

  @Output() projectStatusId = new EventEmitter();
  @Output() officeId = new EventEmitter();
  @Output() assetsTypeID = new EventEmitter();
  @Output() maintabID = new EventEmitter();

  // Contractors Evaluation Outputs
  @Output() contractorId = new EventEmitter();
  @Output() buildingId = new EventEmitter();
  @Output() planTypeId = new EventEmitter();

  // Evaluation Settings Outputs
  @Output() durationId = new EventEmitter();
  @Output() planTypeIdSettings = new EventEmitter();

  @Input() dropdownStatus: boolean = false;
  @Input() validity: boolean;
  @Input() isAssets: boolean = false;
  @Input() isMaintab: boolean = false;
  @Input() isContractorsEvaluation: boolean = false;
  @Input() isEvaluationSettings: boolean = false;
  @Input() selectedTabId!: number;
    @Input() isSearch: boolean = true;

  constructor(private router: Router) {}
  addButtonFun() {
    this.addButton.emit();
  }
  valueSearchFun(value: string) {
    this.valueSearch.emit(value);
  }
  onFilterClickFun() {
    this.onFilterClick.emit();
  }

  // FUNCTION TO ADD EDIT
  save() {
    this.submitReq.emit();
  }
  cancel() {
    this.cancelReq.emit();
  }
  changeprojectStatusID(value: any) {
    this.projectStatusId.emit(value.value);
  }
  changeofficeID(value: any) {
    this.officeId.emit(value.value);
  }
  changeassetsTypeID(value: any) {
    this.assetsTypeID.emit(value.value);
  }
  changeselectedTab(value: any) {
    this.maintabID.emit(value.value);
  }

  // Contractors Evaluation Change Functions
  changeContractorID(value: any) {
    this.contractorId.emit(value.value);
  }
  changeBuildingID(value: any) {
    this.buildingId.emit(value.value);
  }
  changePlanTypeID(value: any) {
    this.planTypeId.emit(value.value);
  }

  // Evaluation Settings Change Functions
  changeDurationID(value: any) {
    this.durationId.emit(value.value);
  }
  changePlanTypeIDSettings(value: any) {
    this.planTypeIdSettings.emit(value.value);
  }

  routeToSettingMonthly() {
    this.router.navigate(['/monthly-report']);
  }
}
