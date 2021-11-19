import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from './../../../@shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { CountryNames } from '@app/@shared/Models/countryNames';
interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  isLoading: boolean = false;
  type: string;
  Form!: FormGroup;
  CountryCodes$: Observable<any>;
  countries: Country[] = [
    { value: 'option-0', viewValue: 'Option 1' },
    { value: 'option-1', viewValue: 'Option 2' },
    { value: 'option-2', viewValue: 'Option 3' },
  ];
  user_id: any;
  data: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {
    this.getCountriesList();
    this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.user_id = params.id;
      this.type = params.type;
      this.getUserData();
    });
  }

  getCountriesList() {
    this.dataService.get_WithoutCount(`/country`, CountryNames).subscribe((res: any) => {
      console.log(res);
      this.CountryCodes$ = of(res);
    });
  }

  getUserData() {
    this.data = this.dataService.getSelectedData().subscribe((res: any) => {
      res.is_verified = res.action;
      this.updateFormValues(res);
    });
  }

  updateFormValues(data: any) {
    this.Form.patchValue(data);
  }

  private createForm() {
    this.Form = this.formBuilder.group({
      id: [''],
      user_name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      country_id: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', [Validators.required, Validators.maxLength(50)]],
      phone_number: ['', [Validators.required, Validators.maxLength(50)]],
      is_verified: [false],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  submit() {
    console.log(this.Form.value);
    this.isLoading = true;
    this.dataService.put(`/user/${this.Form.value.id}`, this.Form.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.notifierService.notify('success', 'Updated successfully');
        this.router.navigate(['/user-management']);
      },
      (error) => {
        this.isLoading = false;
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  toggleStatus() {
    this.dataService.put(`/user/toggle_active/${this.user_id}`, {}).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  ngOnDestroy() {
    this.data.unsubscribe();
  }
}
