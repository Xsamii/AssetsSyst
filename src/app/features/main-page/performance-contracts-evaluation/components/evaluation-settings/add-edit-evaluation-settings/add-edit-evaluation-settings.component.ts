import { Component, OnInit } from '@angular/core';
import { EvaluationSettingsService } from '../services/evaluation-settings.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-edit-evaluation-settings',
  templateUrl: './add-edit-evaluation-settings.component.html',
  styleUrls: ['./add-edit-evaluation-settings.component.scss'],
})
export class AddEditEvaluationSettingsComponent implements OnInit {
  // ------------------------------------
  //  VALUES
  // ------------------------------------
  editMode: boolean = false;
  currentId!: number;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;

  // Dropdown Lists
  durationsList: any[] = [];
  planTypesList: any[] = [];

  // Points tracking
  totalPoints: number = 100;
  usedPoints: number = 0;

  // ------------------------------------
  //  SWEET ALERTS FUNCTIONS
  // ------------------------------------
  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/performance-contracts-evaluation/evaluation-settings']);
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
      this._router.navigate(['/performance-contracts-evaluation/evaluation-settings']);
    } else {
      this.alertWarning = false;
    }
  }

  // ------------------------------------
  //  CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _evaluationSettingsService: EvaluationSettingsService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sharedService: SharedService
  ) {}

  // ------------------------------------
  //  FORM
  // ------------------------------------
  evaluationSettingsForm = this._fb.group({
    maintTypeId: [null, Validators.required],
    periodId: [null, Validators.required],
    addTerms: this._fb.array([])
  });

  get formControls() {
    return this.evaluationSettingsForm.controls;
  }

  get evaluationItems(): FormArray {
    return this.evaluationSettingsForm.get('addTerms') as FormArray;
  }

  get remainingPoints(): number {
    return this.totalPoints - this.usedPoints;
  }

  // ------------------------------------
  //  EVALUATION ITEMS MANAGEMENT
  // ------------------------------------
  createEvaluationItem(termName: string = '', termWeight: number = 0, id?: number): any {
    const group: any = {
      termName: [termName, Validators.required],
      termWeight: [termWeight, [Validators.required, Validators.min(0), Validators.max(100)]]
    };

    // Include id only if it exists (for existing terms)
    if (id) {
      group.id = [id];
    }

    const formGroup = this._fb.group(group);

    // Add custom validation that checks against other inputs
    formGroup.get('termWeight')?.valueChanges.subscribe((value) => {
      if (value !== null && value !== '') {
        const numValue = Number(value);
        // Get the index of this item
        const index = this.evaluationItems.controls.indexOf(formGroup);
        const maxAllowed = this.getMaxAllowedForTerm(index);

        if (numValue > maxAllowed) {
          formGroup.get('termWeight')?.setValue(maxAllowed, { emitEvent: false });
        }
      }
    });

    return formGroup;
  }

  addEvaluationItem(): void {
    this.evaluationItems.push(this.createEvaluationItem());
  }

  removeEvaluationItem(index: number): void {
    // Prevent removing the last item - there must always be at least one
    if (this.evaluationItems.length > 1) {
      this.evaluationItems.removeAt(index);
      this.calculateUsedPoints();
    }
  }

  // Calculate total used points from all term weights
  calculateUsedPoints(): void {
    this.usedPoints = 0;
    this.evaluationItems.controls.forEach((control: any) => {
      const weight = control.get('termWeight')?.value || 0;
      this.usedPoints += Number(weight);
    });
  }

  // Get maximum allowed value for a specific term input
  getMaxAllowedForTerm(index: number): number {
    // Calculate used points excluding the current input
    let usedPointsExcludingCurrent = 0;
    this.evaluationItems.controls.forEach((control: any, i: number) => {
      if (i !== index) {
        const weight = control.get('termWeight')?.value || 0;
        usedPointsExcludingCurrent += Number(weight);
      }
    });

    // Maximum for this input = total points - points used by other inputs
    return this.totalPoints - usedPointsExcludingCurrent;
  }

  // ------------------------------------
  //  GET DROPDOWNS
  // ------------------------------------
  getDropDowns() {
    forkJoin({
      durationsReq: this._sharedService.Getperiodss(),
      planTypesReq: this._sharedService.GetmaintPlanTypeForEves()
    }).subscribe(({ durationsReq, planTypesReq }: any) => {
      this.durationsList = durationsReq.data;
      this.planTypesList = planTypesReq.data;
    });
  }

  // ------------------------------------
  //  SAVE
  // ------------------------------------
  save() {
    if (!this.editMode) {
      // CREATE
      const createObj = {
        id: 0,
        maintTypeId: this.evaluationSettingsForm.value.maintTypeId,
        periodId: this.evaluationSettingsForm.value.periodId,
        addTerms: this.evaluationSettingsForm.value.addTerms,
      };

      this._evaluationSettingsService.createEvaluationSetting(createObj).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertSuccessMsg = 'تمت إضافة إعدادات التقييم بنجاح، يمكنك المتابعة';
            this.alertSuccess = true;
          } else {
            this.alertErrorMsg = res.errors[0].message;
            this.alertError = true;
          }
        },
        error: () => {
          this.alertErrorMsg = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
        },
      });
    } else {
      // UPDATE - Separate terms into new and old
      const allTerms = this.evaluationSettingsForm.value.addTerms || [];
      const newTerms = allTerms.filter((term: any) => !term.id).map((term: any) => ({
        termName: term.termName,
        termWeight: term.termWeight
      }));
      const oldTerms = allTerms.filter((term: any) => term.id).map((term: any) => ({
        id: term.id,
        termName: term.termName,
        termWeight: term.termWeight
      }));

      const updateObj = {
        id: this.currentId,
        maintTypeId: this.evaluationSettingsForm.value.maintTypeId,
        periodId: this.evaluationSettingsForm.value.periodId,
        newTerms: newTerms,
        oldTerms: oldTerms
      };

      this._evaluationSettingsService.updateEvaluationSetting(updateObj).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertSuccessMsg = 'تم تعديل إعدادات التقييم بنجاح، يمكنك المتابعة';
            this.alertSuccess = true;
          } else {
            this.alertErrorMsg = res.errors[0].message;
            this.alertError = true;
          }
        },
        error: () => {
          this.alertErrorMsg = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
        },
      });
    }
  }

  // ------------------------------------
  //  CANCEL
  // ------------------------------------
  cancel() {
    this.alertWarning = true;
  }

  // ------------------------------------
  //  NG ON INIT
  // ------------------------------------
  ngOnInit(): void {
    this.getDropDowns();

    // Add initial evaluation item
    this.addEvaluationItem();

    // Subscribe to form changes to track points
    this.evaluationItems.valueChanges.subscribe(() => {
      this.calculateUsedPoints();
    });

    this._activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentId = params['id'];
        this._evaluationSettingsService
          .getEvaluationSettingById(this.currentId)
          .subscribe((res) => {
            if (res.isSuccess) {
              console.log('GetById Response:', res.data);

              this.evaluationSettingsForm.patchValue({
                maintTypeId: res.data.maintTypeId,
                periodId: res.data.periodId,
              });

              // Clear initial item and populate with data
              this.evaluationItems.clear();

              // Check if terms exist in response
              const terms = res.data.addTerms || res.data.terms || [];
              console.log('Terms found:', terms);

              if (terms && terms.length > 0) {
                terms.forEach((item: any) => {
                  console.log('Adding term:', item);
                  this.evaluationItems.push(this.createEvaluationItem(item.termName, item.termWeight, item.id));
                });
              } else {
                this.addEvaluationItem();
              }
            }
          });
      }
    });
  }
}
