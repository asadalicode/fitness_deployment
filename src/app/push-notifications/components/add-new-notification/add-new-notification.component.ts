import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from './../../../@shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Users } from '@app/@shared/Models/users';
import { Coaches } from '@app/@shared/Models/coaches';
import * as _ from 'lodash';
import { Notifications } from '@shared/Models/notifications';
import { NotificationDetail } from '@app/@shared/Models/NotificationDetail';
@Component({
  selector: 'app-add-new-notification',
  templateUrl: './add-new-notification.component.html',
  styleUrls: ['./add-new-notification.component.scss'],
})
export class AddNewNotificationComponent implements OnInit {
  isLoading: boolean = false;
  type: string;
  dropdownSettings: IDropdownSettings;
  Form!: FormGroup;
  admin_id: number;
  data: any = {};
  dropdownList: any = [];
  usersList: Users;
  coachList: Coaches;
  isBusy = false;
  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {
    this.createForm();
    this.getAllUsers();
    this.getAllCoaches();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'full_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false,
    };
    // this.permissions();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.admin_id = params.id;
      this.type = params.type;
      if (this.admin_id) this.getNotificationDetail();
    });
  }

  getNotificationDetail() {
    this.isBusy = true;
    this.dataService
      .getSingle(`/notification/get_notification_detail?id=${this.admin_id}`, NotificationDetail)
      .subscribe(
        (res: any) => {
          let user_ids: any = [];
          let coach_ids: any = [];
          if (res[0].users_ids.length) {
            res[0].users_ids.forEach((elem: any) => {
              let user_obj = {
                id: elem.id,
                full_name: elem.first_name + ' ' + elem.last_name,
              };
              if (elem.user_type == 'Coach') {
                coach_ids.push(user_obj);
              } else {
                user_ids.push(user_obj);
              }
            });
          }
          res[0].users_ids = user_ids ? user_ids : [];
          res[0].coach_ids = coach_ids ? coach_ids : [];
          this.updateFormValues(res[0]);
          this.isBusy = false;
        },
        (error) => {
          this.isBusy = false;
        }
      );
  }

  updateFormValues(data: any) {
    console.log(data);
    this.Form.patchValue(data);
  }

  private createForm() {
    this.Form = this.formBuilder.group({
      title_arabic: ['', Validators.required],
      title_english: ['', Validators.required],
      body_english: ['', Validators.required],
      body_arabic: ['', Validators.required],
      users_ids: ['', Validators.required],
      coach_ids: ['', Validators.required],
      // status: false,
    });
  }

  getAllUsers() {
    this.dataService.get_WithoutCount('/notification/get_users', Users).subscribe(
      async (res: any) => {
        console.log(res);
        this.usersList = res;
      },
      (error) => {}
    );
  }

  getAllCoaches() {
    this.dataService.filters.limit = -1;
    this.dataService.get('/coach', Coaches).subscribe(
      async (res: any) => {
        console.log(res);
        this.coachList = res.data;
        this.dataService.filters.limit = 5;
      },
      (error) => {}
    );
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  submit() {
    let users_ids = this.Form.value.users_ids.map((a: any) => a.id);
    let coach_ids = this.Form.value.coach_ids.map((a: any) => a.id);
    let arr_of_ids = users_ids.concat(coach_ids);
    let unique_ids: any = _.uniqWith(arr_of_ids, _.isEqual);
    this.Form.value.users_ids = unique_ids;
    this.Form.value.coach_ids = coach_ids;
    if (this.admin_id) this.Form.value.id = this.admin_id;
    if (!this.Form.valid) return 0;
    this.isLoading = true;
    let url = this.admin_id
      ? this.dataService.put(`/notification/${this.admin_id}`, this.Form.value)
      : this.dataService.post('/notification/', this.Form.value);
    url.subscribe(
      (res: any) => {
        this.router.navigate(['/', 'push-notifications']);
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
  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };
}
