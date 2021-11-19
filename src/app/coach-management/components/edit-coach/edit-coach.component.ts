import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from './../../../@shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { WorkoutPrograms } from '@app/@shared/Models/workoutPrograms';
import { CountryNames } from '@app/@shared/Models/countryNames';
import { Banks } from '@app/@shared/Models/Banks';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CoachDetail } from '@app/@shared/Models/CoachDetail';
import { AppConstants } from '@app/@shared/constants/app-constants';
interface Country {
  value: string;
  viewValue: string;
}
export interface Tag {
  name: string;
}

@Component({
  selector: 'app-edit-coach',
  templateUrl: './edit-coach.component.html',
  styleUrls: ['./edit-coach.component.scss'],
})
export class EditCoachComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: String[] = [];
  visible = true;
  id: any;
  workoutPrograms: Observable<any>;
  CountryCodes$: Observable<any>;
  BankCodes$: Observable<any>;
  imgURL: string | ArrayBuffer;
  isLoading: boolean = false;
  edit: boolean = true;

  type: string;

  Form!: FormGroup;
  permissionsData: any = [];
  data: Subscription;
  selectedValue: string;
  dropdownSettings: IDropdownSettings;
  isBusy: boolean = false;
  coachData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {
    this.createForm();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false,
    };
    // this.permissions();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.type = params.type;
      if (this.id) {
        this.getDetails();
        this.getWorkoutPrograms();
        this.getCountriesList();
        this.getBankListing();
      }
    });
  }

  updateFormValues(data: any) {
    (data.id = this.id), this.Form.patchValue(data);
  }

  toggleStatus() {
    this.dataService.put(`/coach/toggle_active/${this.coachData.id}`, {}).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
        this.getDetails();
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  getDetails() {
    this.isBusy = true;
    this.dataService.get_WithoutCount(`/user/getUserById/${this.id}`, CoachDetail).subscribe(
      async (res: any) => {
        console.log(res[0]);
        this.coachData = res[0];

        if (res[0].document_image) {
          let img_url = await AppConstants.Instance.readUrlAsFile(res[0].document_image);

          this.tags.push(img_url);
          this.Form.patchValue({
            document_image: this.tags[0],
          });
        }
        this.updateFormValues(res[0]);
        // this.workoutPrograms = res[0]?.workout_program_type_ids || [];
        this.touch();
        this.isBusy = false;
      },
      (error) => {
        this.isBusy = false;
      }
    );
  }

  getWorkoutPrograms() {
    this.dataService.get_WithoutCount('/workout_program_type', WorkoutPrograms).subscribe((res: any) => {
      this.workoutPrograms = res;
      console.log(this.workoutPrograms);
    });
  }

  getCountriesList() {
    this.dataService.get_WithoutCount(`/country`, CountryNames).subscribe((res: any) => {
      this.CountryCodes$ = of(res);
    });
  }

  getBankListing() {
    this.dataService.get_WithoutCount('/banks/banksListing', Banks).subscribe((res: any) => {
      this.BankCodes$ = of(res);
    });
  }

  upload(event: any) {
    if (event.target.files.length === 0) return;
    const files = event.target.files;
    this.Form.patchValue({
      document_image: files[0],
    });
    this.tags.push(files[0]);
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  touch() {
    this.Form.controls.document_image.markAsTouched();
  }

  private createForm() {
    this.Form = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.maxLength(15)]],
      last_name: ['', [Validators.required, Validators.maxLength(15)]],
      user_name: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required, Validators.maxLength(50)]],
      phone_number: ['', [Validators.required]],
      bank_swift_code: ['', [Validators.required]],
      account_currency: ['', [Validators.required]],
      account_number: [''],
      iban_number: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      bank_id: ['', [Validators.required]],
      country_id: ['', [Validators.required, Validators.maxLength(50)]],
      signature: [''],
      document_image: ['', Validators.required],
      workout_program_type_ids: ['', Validators.required],
      expiry_date: ['', Validators.required],
      subscription_price: ['', Validators.required],
      full_name: [''],
      is_active: [false],
    });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value);
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  submit() {
    if (!this.Form.valid) return 0;

    this.isLoading = true;
    this.Form.value.document_image = this.tags;
    let workout_program_type_ids = this.Form.value.workout_program_type_ids.map((a: any) => a.id);
    this.Form.value.workout_program_type_ids = JSON.stringify(workout_program_type_ids);

    this.dataService.putFormData(`/user/coach/${this.id}`, this.Form.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.notifierService.notify('success', 'Coach updated successfully');
        this.router.navigate(['/coach-management']);
      },
      (error) => {
        this.isLoading = false;
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }
}
