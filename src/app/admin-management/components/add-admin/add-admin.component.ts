import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from './../../../@shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { switchMap, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Permissions } from '@app/@shared/Models/permissions';
import { UserServiceService } from '@app/chat/database/DbServices/user-service.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent implements OnInit {
  isLoading: boolean = false;
  edit: boolean = true;
  type: string;
  Form!: FormGroup;
  permissionsData: any = [];
  admin_id: number;
  data: Subscription;
  userData: any;
  isBusy: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private _userService: UserServiceService
  ) {
    this.createForm();
    this.permissions();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.admin_id = params.id;
      this.type = params.type;
      if (this.admin_id) this.getUserData();
    });
  }

  getUserData() {
    this.data = this.dataService.getSelectedData().subscribe((res: any) => {
      res.is_verified = res.action;
      this.userData = res;
      console.log(this.userData);
    });
  }
  updateFormValues(data: any) {
    data.pages_access = this.getCheckboxes(this.permissionsData, data.permission);
    this.Form.patchValue({
      name: data.user_name,
      email: data.email,
      password: data.password,
      role: data.role,
      is_active: data.action,
      permissions: data.pages_access,
    });
  }

  private createForm() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      role: ['', Validators.required],
      is_active: [true],

      permissions: new FormArray([]),
    });
  }
  get permissionsFormArray() {
    return this.Form.controls.permissions as FormArray;
  }

  private addCheckboxes() {
    this.permissionsData.forEach(() => this.permissionsFormArray.push(new FormControl(null)));
  }
  get getCheckboxValues() {
    const selectedPermissionsIds = this.Form.value.permissions
      .map((checked: any, i: any) => (checked ? this.permissionsData[i].id : null))
      .filter((v: any) => v !== null);
    return selectedPermissionsIds;
  }

  checkBoxAtleastSelected() {
    let check = this.Form.controls.permissions.value.some((e: any) => e == true);
    if (check === true) {
      this.Form.controls.permissions.setErrors(null);
    } else this.Form.controls.permissions.setErrors({ required: true });
  }

  getCheckboxes(data: any, elem: any) {
    let arr: any = [];
    for (var i = 0; i < elem.length; i++) {
      arr.push(Number(elem[i].id));
    }
    const booleans = data.map((el: any) => {
      return arr.includes(el.id);
    });
    return booleans;
  }

  permissions() {
    this.isBusy = true;
    this.dataService.get_WithoutCount('/admin/get_all_permissions', Permissions).subscribe(
      (res: any) => {
        this.permissionsData = res;
        this.addCheckboxes();
        if (this.admin_id) {
          this.updateFormValues(this.userData);
        }
        this.isBusy = false;
      },
      (error) => {
        this.isBusy = false;
      }
    );
  }

  submit() {
    this.checkBoxAtleastSelected();
    if (this.Form.invalid) {
      return 0;
    }
    // this.isLoading = true;
    let admin_chat_access = {
      isChatAccess: this.Form.value.permissions[5],
    };

    if (this.admin_id && this.userData.firebase_key) {
      this._userService.updateAdminChatAccess(this.userData.firebase_key, admin_chat_access);
    }
    this.Form.value.permissions_ids = this.getCheckboxValues;

    let request = this.admin_id
      ? this.dataService.put(`/admin/${this.admin_id}`, this.Form.value)
      : this.dataService.post('/admin', this.Form.value);
    request.subscribe(
      (res: any) => {
        this.router.navigate(['/', 'admin-management']);
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
    console.log(this.Form);
  }
  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };
  // permissions() {
  //   this.isLoading = true;
  //   this.dataService.permissions().subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       this.permissionsData = res;
  //       this.addCheckboxes();

  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //     }
  //   );
  // }
  // updateAdmin() {
  //   this.Form.value.id = this.admin_id;
  //   this.Form.value.permissions = JSON.stringify(this.getCheckboxValues);

  //   console.log(this.Form);

  //   this.dataService.updateAdmin(this.Form.value).subscribe((res: any) => {
  //     this.router.navigate(['/', 'admin-management']);

  //     this.notifierService.notify('success', 'admin updated');
  //     console.log(res);
  //   });
  // }
}
