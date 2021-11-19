import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from '../../authentication.service';
import { DataService } from '@app/@shared/services/data.service';
import { MustMatch } from '@app/@shared/Models/must-match.validator';

const log = new Logger('Login');
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
})
export class CreatePasswordComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  Form!: FormGroup;
  isLoading = false;
  userEmail: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private notifierService: NotifierService,
    private dataService: DataService
  ) {
    this.route.queryParams.subscribe((res: any) => {
      if (res) {
        this.userEmail = res.email;
      }
    });
    this.createForm();
  }

  ngOnInit() {}

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  private createForm() {
    this.Form = this.formBuilder.group(
      {
        password: ['', Validators.required],
        repeat_password: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'repeat_password'),
      }
    );
  }

  submit() {
    this.isLoading = true;
    let data = {
      email: this.userEmail,
      password: this.Form.value.password,
      new_password: this.Form.value.repeat_password,
    };
    this.dataService.post('/admin/updateAdminPasswords', data).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Password reset successfully');
        this.router.navigate(['/login']);
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
