import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from '../../authentication.service';
import { DataService } from '@app/@shared/services/data.service';

const log = new Logger('Login');

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  Form!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private notifierService: NotifierService,
    private dataService: DataService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  private createForm() {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      remember: true,
    });
  }

  submit() {
    this.isLoading = true;
    this.dataService.post(`/admin/reset_password_via_link`, { email: this.Form.value.email }).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Email sent successfully');
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        if (error.error.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Oops! Something went wrong');
      }
    );
  }
}
