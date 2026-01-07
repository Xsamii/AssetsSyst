import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthlyReportService } from '../monthly-report.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';

import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';
import { FilesService } from 'src/app/Shared/services/files.service';

@Component({
  selector: 'app-sub-tab',
  templateUrl: './sub-tab.component.html',
  styleUrls: ['./sub-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ReactiveFormsModule,
    RadioButtonModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    NgSelectModule,
    SweetAlertMessageComponent,
    UploadFileComponent,
  ],
})
export class SubTabComponent implements OnInit {
  showBreadcrumb: boolean = true;
  subList!: any[];
  id!: number;
  showAddFile: boolean = false;
  uploadedFiles: File[] = [];
  mainNameTab!: string;
  subname!: string;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertFailureMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private MonthlyReportService: MonthlyReportService,
    private _fileService: FilesService
  ) {}
  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = +params.get('id')!;
      this.mainNameTab = params.get('name')!;
      this.subname = params.get('subname')!;
    });

    this.getsubTab(this.id);
  }

  getsubTab(id: number) {
  
    this.MonthlyReportService.GetSubTabweebData(id).subscribe({
      next: (res: any) => {
        this.subList = res.data ?? [];
      },
      error: (err) => {
        console.error('Error loading main tab data', err);
      },
    });
  }
  toggleAddFilePopup() {
    this.showAddFile = !this.showAddFile;
    this.uploadedFiles = [];

    this.getDraftFiles();
  }

  async AddSubFile() {
    this.MonthlyReportService.addSubTabweebFilse({
      route: '/sub-tab/add',
      tabweebId: this.id,
    }).subscribe((res) => {
      if (res.isSuccess) {
        this.showAddFile = false;
        this.getsubTab(this.id);
      }
    });
  }

  async getDraftFiles() {
    this._fileService.getPickedFiles('/sub-tab/add').subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
        e.progress = 100;
        e.id = null;
      });
      this.uploadedFiles = [...res.data];
    });
  }

  downloadFile(fileUrl: any) {
    fetch(fileUrl.fullPath)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileUrl.originalName;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      });
  }
  FileId:number
  openFolder(sub: any) {
    window.open(sub.fullPath, '_blank');
  }
confirmDelete(event){
  this.alertConfirm =true
  this.FileId =event.id

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
      let body ={
        TabweebId:this.id,
        FileId: this.FileId 
      }
      this.MonthlyReportService.deleteTabweebFiles(body).subscribe(
        (res) => {
          this.getsubTab(this.id);
          this.alertConfirm = false;
          if (res.isSuccess) {
            this.alertSuccess = true;
          } else {
            this.alertError = true;
            this.alertFailureMessage = res.errors[0].message;
          }
          this.alertSuccessMsg = 'تم حذف التبويب  بنجاح، يمكنك المتابعة';
        }
      );
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
