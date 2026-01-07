import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SurveyEnum } from 'src/app/Shared/enums/surveyEnum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  constructor(private surveyService: SurveyService, private activatedRoute: ActivatedRoute) { }

  survey!: any;
  answers: any = {};
  surveyEnum = SurveyEnum;
  currentId;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertError: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.currentId = Number(param['id']);
      this.getServeyDetails(this.currentId)
    });
  }

  // Get or generate a unique device identifier (since browsers can't access real MAC address)
  // Format: XX-XX-XX-XX-XX-XX (17 characters total including dashes)
  getDeviceIdentifier(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      // Generate a MAC-address-like identifier with 17 characters
      const chars = '0123456789ABCDEF';
      const segments = [];
      for (let i = 0; i < 6; i++) {
        const segment = chars.charAt(Math.floor(Math.random() * 16)) +
                       chars.charAt(Math.floor(Math.random() * 16));
        segments.push(segment);
      }
      deviceId = segments.join('-'); // Format: XX-XX-XX-XX-XX-XX
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  getServeyDetails(id: number) {
    this.surveyService.getSurveyById(id).subscribe((res) => {
      this.survey = res.data;
      this.survey.surveycategories.forEach((cat: any) => {
        cat.surveyQuestions.forEach((q: any) => {
          this.answers[q.id] = {
            questionId: q.id,
            answerId: null,
            note: "",
            rateAnswer: 0
          };
        });
      });
    });
  }

  isSurveyComplete(): boolean {
    if (!this.survey) return false;

    for (let category of this.survey.surveycategories) {
      for (let q of category.surveyQuestions) {
        const ans = this.answers[q.id];
        if (!ans) return false;

        switch (q.typeId) {
          case this.surveyEnum.Choice:
          case this.surveyEnum.BoolChoice:
            if (!ans.answerId) return false;
            break;
          case this.surveyEnum.Text:
            if (!ans.note || ans.note.trim() === '') return false;
            break;
          case this.surveyEnum.Rating:
          case this.surveyEnum.StarsRating:
            if (!ans.rateAnswer || ans.rateAnswer <= 0) return false;
            break;
          default:
            return false;
        }
      }
    }
    return true;
  }


  submitSurvey() {
    const payload = Object.values(this.answers);
    const macAddress = this.getDeviceIdentifier();

    console.log("Payload ready:", payload);
    console.log("Survey ID:", this.currentId);
    console.log("Device MAC Address:", macAddress);

    this.surveyService.addSurvey(payload, this.currentId, macAddress).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم الاجابة علي الاستبيان بنجاح';
        } else {
          this.alertError = true;
          this.alertFailureMessage = res.errors[0].message;
        }
      }, (err) => {
        this.alertError = true;
        this.alertFailureMessage = err.errors[0].message || 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
      });
  }
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }
  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

}
