import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ProjectSettingsService } from './services/project-settings.service';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [
    BreadCrumbComponent,
    CommonModule,
    SweetAlertMessageComponent,
    DirectivesModule,
    ReactiveFormsModule
  ],
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent {

  data
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  projectSettingsForm = this._fb.group({
    timePeriodForSubmittingTheApplication: [],
    numberOfRequestsForConsultationPerDay: [],
    numberOfRequestsForCustomizablePerDay: [],
    customizableNumberOfVisitsPerDay: []
  });

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _projectSettingsService: ProjectSettingsService,
  ) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._projectSettingsService.getSettings().subscribe(res => {
      this.data = res.data
      this.projectSettingsForm.patchValue(this.data)
    })
  }

  // ------------------------------------
  //  SWEET ALERTS FUNCTIONS
  // ------------------------------------
  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['projects/project-settings']);
      this.alertSuccess = false;

    }
  }
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
      this.projectSettingsForm.patchValue(this.data)
      this._router.navigate(['projects/project-settings']);

    } else {
      this.alertWarning = false;
    }
  }

  // ------------------------------------
  //  SAVE SETTINGS
  // ------------------------------------
  onSubmit() {
    this._projectSettingsService.updateSettings(this.projectSettingsForm.value).subscribe(res => {
      if (res.isSuccess) {
        this.alertSuccessMsg =
          'تم تعديل إعدادات النظام بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
      } else {
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }

}
