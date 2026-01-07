export class listColumns {
  field?: string;
  header?: string;
  isLevee?: boolean = false;
  isShowRequest?: boolean = false;
  isShowMaintenaceRequest?: boolean = false;
  supervisoryMaintenanceRequests?: boolean = false;
  executiveMaintenanceRequests?: boolean = false;
  isCurrency?: boolean = false;
  isDate?: boolean = false;
  isPercentage?: boolean = false;
  isUserType?: boolean = false;
  userType?: any;
  priority?: any;
  maintenanceRequestStatusId?: any;
  statusPartsID?:any
  visitRequestStatusId?: any;
  attachmentTypeId? : any;
  inactive?: boolean;
  isColor?: boolean;
  statusClass?: string = '';
  statusBadgeField?: string = '';
  viewButton? : boolean = false;
  isClickable? : boolean = false;
  fullPath?: string;
  isPicked?: boolean = false;
  financialConnection:any;
  isChecked: boolean = false;
  public constructor(init?: Partial<listColumns>) {
    Object.assign(this, init);
  }
}
