import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingSettingsService } from '../../services/rating-settings.service';
import { error } from 'highcharts';
import { SurveyEnum } from 'src/app/Shared/enums/surveyEnum';

@Component({
  selector: 'app-add-edit-rating',
  templateUrl: './add-edit-rating.component.html',
  styleUrls: ['./add-edit-rating.component.scss']
})
export class AddEditRatingComponent {

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private surveyService: RatingSettingsService, private router: Router) {
    this.activatedRoute.params.subscribe((param) => {
      this.currentId = param['id'];
      if (this.currentId != null && this.currentId != undefined) {
        this.isEdite = true;
      } else {
        this.isEdite = false;
      }
    });
  }

  form: FormGroup;
  isEdite: boolean = false;
  currentId;
  departmentsList: any[] = [];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertError: boolean = false;
  surveyEnum = SurveyEnum;

  typesList = [
    { id: 1, name: 'اختيار متعدد' },
    { id: 2, name: 'نصي' },
    { id: 3, name: 'تقييم' },
    { id: 4, name: 'تقييم بالنجوم' },
    { id: 5, name: 'اختيار نعم او لا' },
  ];

  ngOnInit() {
    this.form = this.fb.group({
      formName: [null, Validators.required],
      departments: this.fb.array([], Validators.required),
      questions: this.fb.array([], Validators.required),
    });

    if (this.isEdite) {
      this.loadRatingData();
    } else {
      this.addDepartment();
      this.addQuestion();
    }

    // Listen to changes in departments to update the dropdown
    this.departments().valueChanges.subscribe(() => {
      this.updateDepartmentsList();
    });

    // Initialize the departments list
    this.updateDepartmentsList();
  }

  addDepartment(existing?: any) {
    const dept = this.fb.group({
      id: [existing?.id || this.generateNewDepartmentId()],
      name: [existing?.name || '', Validators.required],
    });

    this.departments().push(dept);
  }

  generateNewDepartmentId(): number {
    const current = this.departments().value;
    return current.length ? Math.max(...current.map((d: any) => d.id)) + 1 : 1;
  }

  removeDepartment(index: number) {
    if (this.departments().length > 1) {
      this.departments().removeAt(index);
    }
  }

  updateDepartmentsList() {
    this.departmentsList = this.departments().value
      .filter((dept: any) => dept.name && dept.name.trim() !== '')
      .map((dept: any) => ({ id: dept.id, name: dept.name }));
  }



  departments(): FormArray {
    return this.form.get('departments') as FormArray;
  }


  questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }


  addQuestion(existing?: any) {
    const q = this.fb.group({
      id: [existing?.id || 0],
      name: [existing?.name || '', Validators.required],
      departmentId: [existing?.departmentId ?? null, Validators.required],
      typeId: [existing?.typeId ?? null, Validators.required],
      choices: [existing?.choices || []],
      answers: [existing?.answers || []],
    });

    this.questions().push(q);
  }

  removeQuestion(index: number) {
    if (this.questions().length > 1) {
      this.questions().removeAt(index);
    }
  }


  onQuestionTypeChange(event: any, q: FormGroup) {
    const typeId = event.value;

    if (typeId === this.surveyEnum.Choice) {
      if (!q.value.choices || q.value.choices.length === 0) {
        q.patchValue({ choices: [''] });
      }
    } else if (typeId === this.surveyEnum.BoolChoice) {
      q.patchValue({ choices: ['نعم', 'لا'] });
    } else {

      q.patchValue({ choices: [] });
    }
  }


  addChoice(q: FormGroup) {
    const choices = [...q.value.choices, ''];
    q.patchValue({ choices });
  }


  removeChoice(q: FormGroup, index: number) {
    const choices = q.value.choices.filter((_: any, i: number) => i !== index);
    q.patchValue({ choices });
  }


  setChoiceValue(q: FormGroup, event: any, index: number) {
    const value = event.target.value;
    const choices = [...q.value.choices];
    choices[index] = value;
    q.patchValue({ choices });
  }

  loadRatingData() {
    this.surveyService.getSurveyById(this.currentId!).subscribe((res: any) => {
      if (!res.isSuccess || !res.data) return;

      const data = res.data;
      console.log('Raw data from backend:', data);


      const departments = data.surveycategories.map((cat: any) => ({
        id: cat.id,
        name: cat.categoryName,
      }));

      const questions = data.surveycategories.flatMap((cat: any) =>
        cat.surveyQuestions.map((q: any) => ({
          id: q.id,
          name: q.questionName,
          departmentId: cat.id,
          typeId: q.typeId,
          choices: q.surveyQuestions?.map((ans: any) => ans.answerName) || [],
          answers: q.surveyQuestions?.map((ans: any) => ({ id: ans.id, answerName: ans.answerName })) || []
        }))
      );



      this.departments().clear();
      this.questions().clear();


      departments.forEach((dept: any) => this.addDepartment(dept));
      questions.forEach((q: any) => this.addQuestion(q));


      this.form.patchValue({
        formName: data.formName,
      });

      this.updateDepartmentsList();

      console.log('Form after patch:', this.form.value);
    });
  }


  submitData() {
    this.form.markAllAsTouched();


    this.questions().controls.forEach(q => {
      if (q.get('typeId')?.value === this.surveyEnum.Choice) {
        q.get('choices')?.markAsTouched();
      }
    });

    if (this.form.invalid) {
      return;
    }

    if (!this.validateChoices()) {
      return;
    }

    const formValue = this.form.value;

    if (!this.isEdite) {
      const payload = {
        formName: formValue.formName,
        surveycategories: formValue.departments.map((dept: any) => ({
          categoryName: dept.name,
          surveyQuestions: formValue.questions
            .filter((q: any) => q.departmentId === dept.id)
            .map((q: any) => ({
              questionName: q.name,
              typeId: q.typeId,
              surveyQuestions:
                q.typeId === this.surveyEnum.Choice || q.typeId === this.surveyEnum.BoolChoice
                  ? q.choices.map((choice: string) => ({
                    answerName: choice,
                  }))
                  : [],
            })),
        })),
      };

      this.surveyService.addSurvey(payload).subscribe((res) => {
        if (res.isSuccess) {
          this.form.reset();
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تمت إضافة مؤشر التقييم بنجاح، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertFailureMessage = res.errors[0].message;
        }
      }, (err) => {
        this.alertError = true;
        this.alertFailureMessage = err.errors[0].message || 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
      })
    }
    else {
      const payload = {
        id: Number(this.currentId),
        formName: formValue.formName,
        surveycategories: formValue.departments.map((dept: any) => ({
          id: dept.id,
          categoryName: dept.name,
          surveyQuestions: formValue.questions
            .filter((q: any) => q.departmentId === dept.id)
            .map((q: any) => ({
              id: q.id, // مهم جداً في حالة التعديل
              questionName: q.name,
              typeId: q.typeId,
              surveyQuestions:
                q.typeId === this.surveyEnum.Choice || q.typeId === this.surveyEnum.BoolChoice
                  ? q.choices.map((choice: string, index: number) => ({
                    id: q.answers?.[index]?.id ?? 0, // هنا بنرجع الـ answerId لو موجود
                    answerName: choice,
                  }))
                  : q.answers?.map((a: any) => ({
                    id: a.id,
                    answerName: a.answerName
                  })) ?? []
            })),
        })),
      };


      this.surveyService.updateSurvey(payload).subscribe((res) => {
        if (res.isSuccess) {
          this.form.reset();
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تمت تعديل مؤشر التقييم بنجاح، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertFailureMessage = res.errors[0].message;
        }
      }, (err) => {
        this.alertError = true;
        this.alertFailureMessage = err.errors[0].message || 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
      });
    }

  }

  validateChoices(): boolean {
    const questions = this.questions().controls;
    let allValid = true;

    questions.forEach(q => {
      if (q.get('typeId')?.value === this.surveyEnum.Choice) {
        const validChoices = q.value.choices.filter((c: string) => c && c.trim() !== '');
        if (validChoices.length < 2) {
          q.get('choices')?.setErrors({ minChoices: true });
          allValid = false;
        } else {
          q.get('choices')?.setErrors(null);
        }
      }
    });

    return allValid;
  }




  // SUCCESS
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
      this.router.navigate(['/maintenance/rating-settings'])
    }
  }
  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

  closeRating() {
    this.router.navigate(['/maintenance/rating-settings'])
  }
}
