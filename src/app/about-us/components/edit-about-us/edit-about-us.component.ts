import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { aboutUs } from '@app/@shared/Models/aboutUs';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-about-us',
  templateUrl: './edit-about-us.component.html',
  styleUrls: ['./edit-about-us.component.scss'],
})
export class EditAboutUsComponent implements OnInit {
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
      this.getAboutus();
    });
  }

  getAboutus() {
    this.dataService.getSingle('/about_us', aboutUs).subscribe((res: any) => {
      this.data = res[0];
      this.updateFormValues(res[0]);
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
      aboutus_en: data.value,
      aboutus_ar: data.value_arabic,
    });
  }

  private createForm() {
    this.Form = this.fb.group({
      aboutus_en: ['', [Validators.required]],
      aboutus_ar: ['', [Validators.required]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  submit() {
    if (!this.Form.valid) return 0;
    this.isLoading = true;
    this.dataService.put('/about_us/', this.Form.value).subscribe(
      (res: any) => {
        this.router.navigate(['/', 'about-us']);
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
  //   // this.data.unsubscribe();
  // }
}
