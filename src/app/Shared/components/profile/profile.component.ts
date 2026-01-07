import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './services/profile.service';
import { SweetAlertMessageComponent } from '../sweet-alert-message/sweet-alert-message.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // =======================================
  // VALUES
  // =======================================
  curentRoute: any;
  errorAlert: boolean = false;
  successAlert: boolean = false;
  img: any;
  imgSrc!: string | ArrayBuffer | null;
  profileData;
  // =======================================
  // CONSTRUCTOUR
  // =======================================
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _profileService: ProfileService
  ) {}

  // =======================================
  // FORM
  // =======================================
  profileForm = this._fb.group({
    fullName: [''],
    mobile: [''],
    email: [''],
    jobId: [''],
    jobName: [''],
    nationId: [''],
    photoPath: [''],
    password: [''],
  });
  get formControl() {
    return this.profileForm.controls;
  }

  // =======================================
  // GET PROFILE
  // =======================================

  getProfile() {
    this._profileService.getProfile().subscribe((res) => {
      this.profileData = res.data;
      this.imgSrc = res.data.photoPath;
      const profileData = {
        imgSrc: res.data.photoPath,
        fullName: res.data.fullName,
        jobName: res.data.jobName,
      };
      this._profileService.changeProfileImage(profileData);
      this.profileForm.patchValue({
        fullName: res.data.fullName,
        mobile: res.data.mobile,
        email: res.data.email,
        jobName: res.data.jobName,
        nationId: res.data.nationId,
        photoPath: res.data.photoPath,
      });
    });
  }

  // =======================================
  // SHOW HIDE PASSWORD
  // =======================================
  passwordType: string = 'password';
  showPassword: boolean = false;
  onShowPassword() {
    if (this.passwordType == 'password') {
      this.passwordType = 'text';
      this.showPassword = true;
    } else {
      this.passwordType = 'password';
      this.showPassword = false;
    }
  }
  confirmPasswordType: string = 'password';
  showConfirmPassword: boolean = false;
  onShowConfirmPassword() {
    if (this.confirmPasswordType == 'password') {
      this.confirmPasswordType = 'text';
      this.showConfirmPassword = true;
    } else {
      this.confirmPasswordType = 'password';
      this.showConfirmPassword = false;
    }
  }
  // ================================================
  // CHANGE IMAGE PROFILE
  // ================================================

  onFileChanged(event: any) {
    const files = event.target.files;
    this.img = event.target.files[0];

    if (files.length === 0) return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
    };
  }
  // ================================================
  //  UPDATE PROFILE
  // ================================================
  update() {
    let formData = new FormData();
    if (this.img) {
      formData.append('Photo', this.img, this.img.name);
    }
    formData.append('FullName', this.profileForm.value.fullName);
    formData.append('email', this.profileForm.value.email);
    formData.append('Mobile', this.profileForm.value.mobile);
    formData.append('NationId', this.profileForm.value.nationId);
    // if (this.profileForm.value.BirthDate)
    //   formData.append(
    //     'BirthDate',
    //     moment(new Date(this.profileForm.value.BirthDate)).format('YYYY-MM-DD') +
    //       'T00:00:00'
    //   );
    if (this.profileForm.value.password)
      formData.append('Password', this.profileForm.value.password);
    this._profileService.updateProfile(formData).subscribe(
      (data) => {
        if (data.isSuccess) {
          this.successAlert = true;
          this.getProfile();
          this._profileService.changeProfileImage(this.imgSrc);
        } else {
          this.errorAlert = true;
        }
      },
      (err) => {
        this.errorAlert = true;
      }
    );
  }

  // =======================================
  // SWEET ALERTS
  // =======================================
  errorFunction(value: boolean) {
    if (value) {
      this.errorAlert = false;
    }
  }

  successFunction(value: boolean) {
    if (value) {
      this.successAlert = false;
    }
  }
  // =======================================
  // ONINIT
  // =======================================
  ngOnInit(): void {
    this.curentRoute = this._router.url.split('/')[1];
    this.getProfile();
  }

  routeBack() {
    this._router.navigate(['/']);
  }
}
