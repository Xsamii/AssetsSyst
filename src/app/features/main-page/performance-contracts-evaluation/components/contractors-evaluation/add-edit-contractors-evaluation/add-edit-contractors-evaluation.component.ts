import { Component, OnInit } from '@angular/core';
import { ContractorsEvaluationService } from '../services/contractors-evaluation.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { FilesService } from 'src/app/Shared/services/files.service';

@Component({
  selector: 'app-add-edit-contractors-evaluation',
  templateUrl: './add-edit-contractors-evaluation.component.html',
  styleUrls: ['./add-edit-contractors-evaluation.component.scss'],
})
export class AddEditContractorsEvaluationComponent implements OnInit {
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
  buildingsList: any[] = [];
  contractorsList: any[] = [];
  evaluationSettingsList: any[] = [];

  // Terms data
  termsData: any[] = [];

  // ------------------------------------
  //  SWEET ALERTS FUNCTIONS
  // ------------------------------------
  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/performance-contracts-evaluation/contractors-evaluation']);
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
      this._router.navigate(['/performance-contracts-evaluation/contractors-evaluation']);
    } else {
      this.alertWarning = false;
    }
  }

  // ------------------------------------
  //  CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _contractorsEvaluationService: ContractorsEvaluationService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sharedService: SharedService,
    private _filesService: FilesService
  ) {}

  // ------------------------------------
  //  FORM
  // ------------------------------------
  contractorsEvaluationForm = this._fb.group({
    buildingId: [null, Validators.required],
    contractorId: [null, Validators.required],
    evaluationContractorId: [null, Validators.required],
    evaluations: this._fb.array([])
  });

  get formControls() {
    return this.contractorsEvaluationForm.controls;
  }

  get evaluationTerms(): FormArray {
    return this.contractorsEvaluationForm.get('evaluations') as FormArray;
  }

  // ------------------------------------
  //  EVALUATION TERMS MANAGEMENT
  // ------------------------------------
  createEvaluationTerm(termName: string = '', termId?: number, rating: number = 0, fileUploads?: any, termAnswerId?: number): any {
    const group: any = {
      termName: [termName],
      rating: [rating, Validators.required],
      fileUploads: [fileUploads || null],
      uploadProgress: [100],
      uploadedFileName: [fileUploads?.originalName || null]
    };

    if (termId) {
      group.termId = [termId];
    }

    if (termAnswerId) {
      group.id = [termAnswerId];
    }

    return this._fb.group(group);
  }

  getTermName(index: number): string {
    const term = this.evaluationTerms.at(index);
    return term.get('termName')?.value || '';
  }

  getFilePreviewUrl(fileUploads: any): string {
    if (fileUploads && fileUploads.fullPath) {
      return fileUploads.fullPath;
    }
    return '';
  }

  // ------------------------------------
  //  EVALUATION SETTING CHANGE
  // ------------------------------------
  onEvaluationSettingChange(event: any) {
    const settingId = event.value;
    if (settingId) {
      // Clear existing terms
      this.evaluationTerms.clear();

      // Fetch terms from the selected evaluation setting
      this._contractorsEvaluationService.EvaluationContractorById(settingId).subscribe({
        next: (res) => {
          // Handle both array response and object with data property
          let terms = [];

          if (Array.isArray(res)) {
            // Response is directly an array
            terms = res;
          } else if (res.isSuccess && res.data) {
            // Response is wrapped in data object
            terms = Array.isArray(res.data) ? res.data : (res.data.addTerms || res.data.terms || []);
          }

          if (terms && terms.length > 0) {
            terms.forEach((term: any) => {
              this.evaluationTerms.push(this.createEvaluationTerm(term.termName, term.id, 0));
            });
          }
        },
        error: (err) => {
          console.error('Error loading evaluation terms:', err);
        }
      });
    }
  }

  // ------------------------------------
  //  GET DROPDOWNS
  // ------------------------------------
  getDropDowns() {
    // Load buildings
    this._sharedService.getAllBuilding().subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.buildingsList = res.data;
        }
      },
      error: (err) => {
        console.error('Error loading buildings:', err);
      }
    });

    // Load contractors
    this._sharedService.getOfficeList().subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.contractorsList = res.data;
        }
      },
      error: (err) => {
        console.error('Error loading contractors:', err);
      }
    });

    // Load evaluation settings (combined plan type + duration)
    this._sharedService.GetEveContracterType().subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.evaluationSettingsList = res.data;
        }
      },
      error: (err) => {
        console.error('Error loading evaluation settings:', err);
      }
    });
  }

  // ------------------------------------
  //  FILE UPLOAD
  // ------------------------------------
  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const term = this.evaluationTerms.at(index);

      // Set uploading state
      term.patchValue({
        uploadProgress: 0,
        uploadedFileName: file.name
      });

      // Determine page route for file upload
      let pageRoute = 'contractors-evaluation/add';
      if (this.editMode) {
        pageRoute = `contractors-evaluation/edit/${this.currentId}`;
      }

      // Upload file
      this._filesService.uploadFileWithProgress(file, pageRoute).subscribe({
        next: (data) => {
          // Update progress
          term.patchValue({ uploadProgress: data.progress });

          // Handle upload complete
          if (data.response && data.response.data && data.response.data.length > 0) {
            const uploadedFile = data.response.data[0];
            term.patchValue({
              fileUploads: {
                filePath: uploadedFile.filePath,
                fullPath: uploadedFile.fullPath,
                originalName: uploadedFile.originalName,
                attachTypeId: uploadedFile.attachTypeId || null,
                contractorDocumentId: null
              },
              uploadProgress: 100,
              uploadedFileName: uploadedFile.originalName
            });
          }
        },
        error: (err) => {
          console.error('File upload error:', err);
          term.patchValue({
            uploadProgress: 100,
            uploadedFileName: null,
            fileUploads: null
          });
          this.alertErrorMsg = 'فشل رفع الملف، من فضلك حاول مرة أخرى';
          this.alertError = true;
        }
      });

      // Clear file input
      event.target.value = '';
    }
  }

  removeFile(index: number) {
    const term = this.evaluationTerms.at(index);
    const fileUploads = term.get('fileUploads')?.value;

    if (fileUploads && fileUploads.filePath) {
      this._filesService.deleteFile(fileUploads.filePath).subscribe({
        next: () => {
          term.patchValue({
            fileUploads: null,
            uploadedFileName: null,
            uploadProgress: 100
          });
        },
        error: (err) => {
          console.error('File delete error:', err);
        }
      });
    }
  }

  // ------------------------------------
  //  SAVE
  // ------------------------------------
  save() {
    const evaluations = this.contractorsEvaluationForm.value.evaluations || [];

    if (!this.editMode) {
      // CREATE - Build the create object
      const createObj = {
        buildingId: this.contractorsEvaluationForm.value.buildingId,
        contractorId: 2112,
        evaluationContractorId: this.contractorsEvaluationForm.value.evaluationContractorId,
        evaluationContractorTermAnswerRateDto: evaluations.map((term: any) => ({
          rate: term.rating,
          termId: term.termId,
          fileUploads: (term.fileUploads && term.fileUploads.filePath) ? term.fileUploads : null
        }))
      };

      this._contractorsEvaluationService.createContractorEvaluation(createObj).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertSuccessMsg = 'تمت إضافة تقييم المقاول بنجاح، يمكنك المتابعة';
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
      // UPDATE - Build the update object
      const updateObj = {
        id: this.currentId,
        buildingId: this.contractorsEvaluationForm.value.buildingId,
        contractorId: this.contractorsEvaluationForm.value.contractorId,
        evaluationContractorId: this.contractorsEvaluationForm.value.evaluationContractorId,
        evaluationContractorTermAnswerRateDto: evaluations.map((term: any) => ({
          rate: term.rating,
          termId: term.termId,
          id: term.id || 0,
          fileToBeRemove: 0,
          fileUploads: (term.fileUploads && term.fileUploads.filePath) ? term.fileUploads : null
        }))
      };

      this._contractorsEvaluationService.updateContractorEvaluation(updateObj).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertSuccessMsg = 'تم تعديل تقييم المقاول بنجاح، يمكنك المتابعة';
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
    // Load dropdown data
    this.getDropDowns();
    // TODO: Load buildings and contractors lists when APIs are provided
    // this.loadBuildingsList();
    // this.loadContractorsList();

    this._activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentId = params['id'];
        this._contractorsEvaluationService
          .getContractorEvaluationById(this.currentId)
          .subscribe((res) => {
            if (res.isSuccess) {
              this.contractorsEvaluationForm.patchValue({
                buildingId: res.data.buildingId,
                contractorId: res.data.contractorId,
                evaluationContractorId: res.data.evaluationContractorId,
              });

              // Populate evaluations
              this.evaluationTerms.clear();
              const evaluations = res.data.evaluations || res.data.evaluationContractorTermAnswerRateDto || [];
              if (evaluations && evaluations.length > 0) {
                evaluations.forEach((item: any) => {
                  this.evaluationTerms.push(
                    this.createEvaluationTerm(
                      item.termName,
                      item.termId,
                      item.rate || item.rating || 0,
                      item.fileUploads,
                      item.id
                    )
                  );
                });
              }
            }
          });
      }
    });
  }
}
