import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TermsConfitions } from '@app/@shared/Models/TermsConditions';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class AddNewComponent implements OnInit {
  Form!: FormGroup;
  type: any;
  data: Subscription;
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService,
    private notifierService: NotifierService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.type = params.type;
      // this.getData();
      this.getTermsandConditions();
    });
  }

  getTermsandConditions() {
    this.dataService.getSingle('/terms_and_conditions', TermsConfitions).subscribe((res: any) => {
      this.data = res[0];
      this.updateFormValues(res[0]);
      console.log(res);
    });
  }
  getData() {
    this.data = this.dataService.getSelectedData().subscribe((res: any) => {
      console.log(res);
      this.updateFormValues(res);
    });
  }

  updateFormValues(data: any) {
    this.Form.patchValue({
      terms_and_conditions_en: data.value,
      terms_and_conditions_ar: data.value_arabic,
    });
  }

  private createForm() {
    this.Form = this.fb.group({
      terms_and_conditions_en: ['', [Validators.required]],
      terms_and_conditions_ar: ['', [Validators.required]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  submit() {
    if (!this.Form.valid) return 0;
    this.isLoading = true;

    this.dataService.put('/terms_and_conditions/', this.Form.value).subscribe(
      (res: any) => {
        this.router.navigate(['/', 'terms-and-conditions']);
        this.notifierService.notify('success', res.message);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  // ngOnDestroy() {
  //   this.data.unsubscribe();
  // }
}
