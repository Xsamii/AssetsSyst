import { DropdownModule } from 'primeng/dropdown';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { listColumns } from './listColumns';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NoDataYetComponent } from '../no-data-yet/no-data-yet.component';
import { ProfileService } from '../profile/services/profile.service';
import { shareReplay } from 'rxjs';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    PaginatorModule,
    TableModule,
    MenuModule,
    ButtonModule,
    NoDataYetComponent,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() noData: boolean = false;
  @Input() isSearching: boolean = false;
  @Input() values!: any[];
  @Input() logValues!: any;
  @Input() isLevee: boolean = false;
  @Input() IsSupervisoryMaintenanceRequests: boolean = false;
  @Input() IsExecutiveMaintenanceRequests: boolean = false;
  @Input() isShowRequest: boolean = false;
  @Input() isOutGoing: boolean = false;
  @Input() isShowMaintenaceRequest: boolean = false;
  @Input() isAssetManageMentEmployeesMaintenaceRequest: boolean = false;
  @Input() IsEmployeeMaintenaceRequestForReview: boolean = false;
  @Input() IsEmployeeMaintenaceRequestForProcess: boolean = false;
  @Input() isParts: boolean = false;
  @Input() isProjectList: boolean = false;
  @Input() isProjectTask: boolean = false;
  @Input() showPiecesActionMenu: boolean = false;
  @Input() cols!: listColumns[];
  @Input() totalPageCount!: number;
  @Input() withControles: boolean = false;
  @Input() withActives: boolean = false;
  @Input() showLocationMenuItem: boolean = false;
  @Input() viewButton: boolean = false;
  @Input() deleteButton: boolean = false;
  @Input() history: boolean = true;
  @Input() isExpandable: boolean = false;
  @Input() isPiecesRequestsView: boolean = false;
  @Input() show3D: boolean = false;
  @Input() isAsset: boolean = false;
  @Input() isAssetLog: boolean = false;
  @Input() isinspectionLog: boolean = false;
  @Input() evaluate: boolean = false;
  @Input() copy: boolean = false;

  @Output() evaluateEvent = new EventEmitter();
  @Output() locationPopUpEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() maintenancelogEvent = new EventEmitter();
  @Output() maintenanceinspectionlogEvent = new EventEmitter();
  @Output() viewOnMap = new EventEmitter();
  @Output() showRequest = new EventEmitter();
  @Output() hasrEvent = new EventEmitter();
  @Output() rowsCountChanged = new EventEmitter();
  @Output() recieveRequest = new EventEmitter();
  @Output() CustomizeProcessing = new EventEmitter();
  @Output() closeRequest = new EventEmitter();
  @Output() addRequestNotes = new EventEmitter();
  @Output() downloadEstimateDocument = new EventEmitter();
  @Output() activeUser = new EventEmitter();
  @Output() disableUser = new EventEmitter();
  @Output() reviewRequest = new EventEmitter();
  @Output() customizePreview = new EventEmitter();
  @Output() statusPreview = new EventEmitter();
  @Output() confirmStatusPreview = new EventEmitter();
  @Output() viewSelectedItem = new EventEmitter();
  @Output() expand = new EventEmitter();
  @Output() initialApproval = new EventEmitter();
  @Output() finalApproval = new EventEmitter();
  @Output() approveEvent = new EventEmitter<any>();
  @Output() ThreedEvent = new EventEmitter();
  @Output() maintenanceToPart = new EventEmitter();
  @Output() copyLink = new EventEmitter();
  // ===========================================
  // VALUES
  // ===========================================
  userTypeId;
  ngOnInit(): void {
    this.profileService
      .getProfile()
      .pipe(shareReplay(1))
      .subscribe((res) => {
        this.userTypeId = res.data?.officeTypeId;
      });
  }
  role = +localStorage.getItem('maintainanceRole');
  items: MenuItem[] | undefined;
  downloadDocument: boolean = true;
  selectedItem: unknown;
  first: number = 0;
  rows: number = 10;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 50, value: 50 },
  ];
  selectedId!: number;
  orderNo!: number;
  selectedIdForSite: any;
  partsData: any;
  partsObj: any = { id: null, orderNumber: null };

  // ===========================================
  // CONSTRUCTOR
  // ===========================================
  constructor(private profileService: ProfileService) { }

  // ===========================================
  // ON PAGE CHANGE
  // ===========================================
  onPageChange(event: any) {
    event;

    this.first = event.first;
    this.rows = event.rows;
    this.rowsCountChanged.emit(event);
  }
  // ===========================================
  // DELETE BUTTON IN MENU
  // ===========================================
  delete(event: any) {
    // (event);
  }
  // ===========================================
  // item clicked
  // ===========================================
  onItemClicked(id: any) {
    this.viewSelectedItem.emit(id);
  }
  onDeleteClicked(id: any) {
    this.deleteEvent.emit(id);
  }

  // ===========================================
  // TOGGLE BUTTON
  // ===========================================
  toggleBtn() {
    if (this.IsSupervisoryMaintenanceRequests) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'ملاحظة',
          disabled:
            this.selectedIdForSite.maintenanceRequestStatusId == 1 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 4,
          icon: 'fa-regular fa-file-lines',
          command: () => this.addRequestNotes.emit(this.selectedId),
        },
        {
          label: 'تخصيص معاينة',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 4 &&
            (this.role == 3 || this.role == 4) &&
            this.userTypeId !== 2,
          icon: 'fa-solid fa-user-plus',
          command: () => this.customizePreview.emit(this.selectedId),
        },

        /////
        {
          label: 'تاكيد حالة المعاينة',
          visible:
            (this.selectedIdForSite.maintenanceRequestStatusId == 6 ||
              this.selectedIdForSite.maintenanceRequestStatusId == 8) &&
            (this.role == 3 || this.role == 4) &&
            this.userTypeId == 1,
          icon: 'fa-regular fa-circle-check',
          command: () => this.confirmStatusPreview.emit(this.selectedIdForSite),
        },
      ];
    } else if (this.IsExecutiveMaintenanceRequests) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'إستلام',
          disabled: this.selectedIdForSite.maintenanceRequestStatusId != 2,
          icon: 'fa-regular fa-circle-check',
          // command: () => this.recieveRequest.emit(this.selectedId),
          command: () => this.CustomizeProcessing.emit(this.selectedId),
        },
        {
          label: 'طلب معاينة',
          visible:
            (this.selectedIdForSite.maintenanceRequestStatusId == 3 ||
              this.selectedIdForSite.maintenanceRequestStatusId == 7) &&
            (this.role == 3 || this.role == 4 || this.role == 5) &&
            this.userTypeId == 2,
          icon: 'fa-solid fa-circle-plus',
          command: () => this.reviewRequest.emit(this.selectedId),
        },
        {
          label: 'طلب قطع غيار',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 1 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 2 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 3,
          disabled: this.selectedIdForSite.maintenanceRequestStatusId == 1,
          icon: 'fa-solid fa-cube',
          command: () => this.maintenanceToPart.emit(this.partsObj),
        },
      ];
    } else if (this.IsEmployeeMaintenaceRequestForReview) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'حالة المعاينة',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 5 &&
            this.role == 5,
          icon: 'fa-regular fa-flag',
          command: () => this.statusPreview.emit(this.selectedId),
        },
      ];
    } else if (this.IsEmployeeMaintenaceRequestForProcess) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'طلب معاينة',
          visible:
            (this.selectedIdForSite.maintenanceRequestStatusId == 3 ||
              this.selectedIdForSite.maintenanceRequestStatusId == 7) &&
            (this.role == 3 || this.role == 4 || this.role == 5) &&
            this.userTypeId == 2,
          icon: 'fa-solid fa-circle-plus',
          command: () => this.reviewRequest.emit(this.selectedId),
        },
        {
          label: 'طلب قطع غيار',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 1 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 2 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 3,
          disabled: this.selectedIdForSite.maintenanceRequestStatusId == 1,
          icon: 'fa-solid fa-cube',
          command: () => this.maintenanceToPart.emit(this.partsObj),
        },
      ];
    } else if (this.isAssetManageMentEmployeesMaintenaceRequest) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'تعديل',
          visible: true,
          disabled:
            this.selectedIdForSite.maintenanceRequestStatusId != 1 &&
            this.selectedIdForSite.modifiedByUserId !== null,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          disabled:
            (this.selectedIdForSite.maintenanceRequestStatusId != 1 &&
              this.selectedIdForSite.modifiedByUserId !== null) ||
            (this.role == 7 &&
              this.selectedIdForSite.maintenanceRequestStatusId == 1),
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
        {
          label: 'تقييم',
          visible: this.selectedIdForSite.maintenanceRequestStatusId == 9,
          icon: 'fa-regular fa-eye',
          command: () => this.evaluateEvent.emit(this.selectedId)
        },
      ];
    } else if (this.isShowMaintenaceRequest) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'استلام',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 2 &&
            (this.role == 3 || this.role == 4) &&
            this.userTypeId == 2,
          icon: 'fa-regular fa-circle-check',
          command: () => this.recieveRequest.emit(this.selectedId),
        },
        {
          label: 'طلب معاينة',
          visible:
            (this.selectedIdForSite.maintenanceRequestStatusId == 3 ||
              this.selectedIdForSite.maintenanceRequestStatusId == 7) &&
            (this.role == 3 || this.role == 4 || this.role == 5) &&
            this.userTypeId == 2,
          icon: 'fa-solid fa-circle-plus',
          command: () => this.reviewRequest.emit(this.selectedId),
        },
        {
          label: 'ملاحظات',
          visible: (this.role == 3 || this.role == 4) && this.userTypeId !== 2,
          icon: 'fa-regular fa-file-lines',
          command: () => this.addRequestNotes.emit(this.selectedId),
        },
        {
          label: 'تخصيص معاينة',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 4 &&
            (this.role == 3 || this.role == 4) &&
            this.userTypeId !== 2,
          icon: 'fa-solid fa-user-plus',
          command: () => this.customizePreview.emit(this.selectedId),
        },
        {
          label: 'حالة المعاينة',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 5 &&
            this.role == 5,
          icon: 'fa-regular fa-flag',
          command: () => this.statusPreview.emit(this.selectedId),
        },
        {
          label: 'تاكيد حالة المعاينة',
          visible: this.role == 3 || this.role == 4,
          disabled: this.selectedIdForSite.maintenanceRequestStatusId != 3,
          icon: 'fa-solid fa-lock',
          command: () => this.closeRequest.emit(this.selectedId),
        },

        {
          label: 'تعديل',
          visible: true,
          disabled:
            this.selectedIdForSite.maintenanceRequestStatusId != 1 &&
            this.selectedIdForSite.modifiedByUserId !== null,

          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          disabled:
            (this.selectedIdForSite.maintenanceRequestStatusId != 1 &&
              this.selectedIdForSite.modifiedByUserId !== null) ||
            (this.role == 7 &&
              this.selectedIdForSite.maintenanceRequestStatusId == 1),
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
        {
          label: 'طلب قطع غيار',
          visible:
            this.selectedIdForSite.maintenanceRequestStatusId == 1 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 2 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 3,
          disabled: this.selectedIdForSite.maintenanceRequestStatusId == 1,
          icon: 'fa-solid fa-cube',
          command: () => this.maintenanceToPart.emit(this.partsObj),
        },
        {
          label: 'تقييم',
          visible: this.selectedIdForSite.maintenanceRequestStatusId == 9,
          icon: 'fa-regular fa-eye',
          command: () => this.evaluateEvent.emit(this.selectedId),
        },
      ];
    } else if (this.evaluate) {
      this.items = [
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
        {
          label: 'تقييم',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.evaluateEvent.emit(this.selectedId),
        },
      ];
    } else if (this.isShowRequest) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
      ];
    } else if (this.isOutGoing) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'تعديل',
          visible: true,
          disabled: this.selectedIdForSite.visitRequestStatusId != 1,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          disabled: this.selectedIdForSite.visitRequestStatusId != 1,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.isProjectList) {
      this.items = [
        {
          label: 'تعديل',
          visible: true,
          disabled: this.role == 3 || this.role == 4 || this.role == 5,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          disabled: this.role == 3 || this.role == 4 || this.role == 5,
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.isProjectTask) {
      this.items = [
        {
          label: 'تعديل',
          visible: true,
          disabled: this.role == 5,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          disabled: this.role == 5,
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.showPiecesActionMenu) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'استلام',
          visible: true,
          icon: 'fa-regular fa-circle-check',
          command: () => this.recieveRequest.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.show3D) {
      this.items = [
        {
          label: 'عرض 3D',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.ThreedEvent.emit(this.partsData),
        },
        // {
        //   label: 'النطاق الجغرافي',
        //   visible: true,
        //   icon: 'fa-solid fa-location-crosshairs',
        //   command: () => this.locationPopUpEvent.emit(this.selectedId),
        // },
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.isParts) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.partsData.id),
        },
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.partsData.id),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.partsData.id),
        },
      ];
    } else if (this.isPiecesRequestsView) {
      let approveBody = {
        id: this.partsData.id,
        statusId: 3,
      };
      let appovelInitialBody = {
        id: this.partsData.id,
        statusId: 2,
      };
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.partsData.id),
        },

        {
          label: ' اعتماد نهائي ',
          visible:
            this.role == UserTypesEnum.Admin ||
            this.role == UserTypesEnum.SystemOfficer,
          disabled:
            this.partsData.statusId == 1 || this.partsData.statusId == 3,
          icon: 'fa-regular fa-circle-check',
          command: () => this.approveEvent.emit(approveBody),
        },

        {
          label: ' اعتماد مبدائي',
          visible: this.role == UserTypesEnum.inventoryManager,
          disabled:
            this.partsData.statusId == 3 || this.partsData.statusId == 2,

          icon: 'fa-regular fa-circle-check',
          command: () => this.approveEvent.emit(appovelInitialBody),
        },
      ];
    } else if (this.isAsset) {
      this.items = [
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'سجل الصيانة',
          visible: true,
          icon: 'fa-solid fa-copy',
          command: () => this.maintenancelogEvent.emit(this.selectedId),
        },
        {
          label: 'سجل الكشف الدوري',
          visible: true,
          icon: 'fa-solid fa-file',
          command: () =>
            this.maintenanceinspectionlogEvent.emit(this.selectedId),
        },
        {
          label: 'عرض في المتابعة المكانية',
          visible: true,
          icon: 'fa-solid fa-file',
          command: () =>
            this.viewOnMap.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.copy) {
      this.items = [
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
        {
          label: 'نسخ الرابط',
          visible: true,
          icon: 'fa-regular fa-clone',
          command: () => this.copyLink.emit(this.selectedId),
        }
      ];
    } else if (this.isAssetLog) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },

        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else if (this.isinspectionLog) {
      this.items = [
        {
          label: 'عرض',
          visible: true,
          icon: 'fa-regular fa-eye',
          command: () => this.showRequest.emit(this.selectedId),
        },
        {
          label: 'تعديل',
          visible: true,
          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },

        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
      ];
    } else {
      this.items = [
        {
          label: 'النطاق الجغرافي',
          visible: this.showLocationMenuItem,
          icon: 'fa-solid fa-location-crosshairs',
          command: () => this.locationPopUpEvent.emit(this.selectedId),
        },
        {
          label: 'تعديل',
          visible: true,
          disabled:
            this.selectedIdForSite.maintenanceRequestStatusId == 2 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 3 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 4 ||
            this.selectedIdForSite.maintenanceRequestStatusId == 5,

          icon: 'fa-regular fa-pen-to-square',
          command: () => this.editEvent.emit(this.selectedId),
        },
        {
          label: 'حذف',
          visible: true,
          icon: 'fa-solid fa-trash-can',
          command: () => this.deleteEvent.emit(this.selectedId),
        },
        {
          label: 'تقييم',
          visible: this.evaluate,
          icon: 'fa-regular fa-eye',
          command: () => this.evaluateEvent.emit(this.selectedId),
        },
      ];
    }
  }
  // ===========================================
  // ON CLICK MENU
  // ===========================================
  onClickedmenu(value: any) {
    this.selectedId = value.id;
    this.selectedIdForSite = value;
    this.orderNo = value.orderNumber;
    this.partsData = value;
    this.partsObj = {
      id: value.id,
      orderNumber: value.orderNumber,
    };
    this.downloadDocument = value.isHasrAdded;
    this.toggleBtn();
  }
  // ===========================================
  // ON INIT
  // ===========================================
  // ngOnInit(): void {}
  // ngOnChanges(): void {}

  activeUserFun(value: any) {
    this.activeUser.emit(value);
  }
  expandedRow: { [key: string]: boolean } = {};
  expandRow(value) {
    Object.keys(this.expandedRow).forEach((key) => {
      if (key !== value.id.toString()) {
        this.expandedRow[key] = false;
      }
    });

    this.expandedRow[value.id] = !this.expandedRow[value.id];

    if (this.expandedRow[value.id]) {
      this.expand.emit(value);
    }
  }

  openWhenClickTd(value: any) {
    if (!value) return;
    if (this.isProjectList || this.isProjectTask || this.show3D) {
      this.editEvent.emit(value.id);
    } else if (
      this.IsSupervisoryMaintenanceRequests ||
      this.isShowMaintenaceRequest ||
      this.IsExecutiveMaintenanceRequests ||
      this.IsEmployeeMaintenaceRequestForReview ||
      this.IsEmployeeMaintenaceRequestForProcess ||
      (this.isAssetManageMentEmployeesMaintenaceRequest && value) ||
      (this.isShowMaintenaceRequest && value) ||
      (this.isShowRequest && value) ||
      this.isOutGoing ||
      this.showPiecesActionMenu ||
      this.isParts ||
      this.isPiecesRequestsView
    ) {
      this.showRequest.emit(value.id);
    } else {
      this.editEvent.emit(value.id);
    }
  }
  openFile(bath: string) {
    window.open(bath, '_blank')
  }
}
