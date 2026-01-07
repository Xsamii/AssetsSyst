import { Component, OnInit } from '@angular/core';
import { IncomingRequestsService } from '../../../incoming-requests/services/incoming-requests.service';
import { ActivatedRoute } from '@angular/router';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit {
  // --------------------------------------
  // VALUES
  // --------------------------------------
  showBreadcrumb: boolean = true;
  requestData: any[] = [];
  requestId: number;
  projectId: number;
  visitRequestStatusId: number;
  userRole = +localStorage.getItem('maintainanceRole');
  userTypes = UserTypesEnum;
  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------
  constructor(
    private _incomingRequestsService: IncomingRequestsService,
    private _activaRoute: ActivatedRoute
  ) {}

  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  getRequestById() {
    this._incomingRequestsService
      .getRequestById(this.requestId)
      .subscribe((res) => {
        this.requestData = res.data;
        this.projectId = res.data.projectId;
        this.visitRequestStatusId = res.data.visitRequestStatusId;
      });
  }
  // --------------------------------------
  // ONINIT
  // --------------------------------------
  ngOnInit(): void {
    this._activaRoute.params.subscribe((res) => {
      this.requestId = res['id'];
    });
    this.getRequestById();
  }
}
