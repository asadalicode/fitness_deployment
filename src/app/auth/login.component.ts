import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from './authentication.service';
import { ChatConstants } from '@app/@shared/constants/chat-constants';
import { UserServiceService } from '@app/chat/database/DbServices/user-service.service';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  Form!: FormGroup;
  isLoading: boolean = false;
  checked = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private notifierService: NotifierService,
    private _userDb: UserServiceService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.Form.value);
    login$
      .pipe(
        finalize(() => {
          this.Form.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials: any) => {
          log.debug(`${credentials.username} successfully logged in`);
          // console.log(credentials['data']);
          // localStorage.setItem('credentials', credentials['data']);
          this.authenticationService.userData = credentials.data;
          let statusObj = {
            online: true,
          };

          /* start: kuwait firebase initilize user Code  or chat*/
          this._userDb.registerUsertoFirebase(credentials);
          this._userDb.updateAdminStatus('admin', statusObj);
          localStorage.setItem(ChatConstants.firebase_key, 'admin');

          /* end: kuwait firebase initilize user Code */
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          this.notifierService.notify('success', 'Successfully logged in');
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
          this.isLoading = false;
          this.notifierService.notify('error', 'Incorrect email or password');
        }
      );
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  private createForm() {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      // , Validators.minLength(5)
      remember: true,
    });
  }
}
