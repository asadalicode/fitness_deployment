import { UserDetailComponent } from '@app/@shared/modals/components/user-detail/user-detail.component';
import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { adminUsers } from '@app/@shared/Models/admins';
import { NotifierService } from 'angular-notifier';
import { AppConstants } from '@app/@shared/constants/app-constants';
import * as _ from 'lodash';
import { UserServiceService } from '@app/chat/database/DbServices/user-service.service';
import { AuthenticationService, CredentialsService } from '@app/auth';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
})
export class AdminManagementComponent implements AfterViewInit {
  tableColumns: {
    name: string;
    dataKey: string;
    position: string;
    isSortable: boolean;
  }[];
  popupRef = new PopupModal(this.matDialog);
  isLoading: boolean = false;
  DeleteComponent = DeleteComponent;
  UserDetailComponent = UserDetailComponent;
  searchString = new FormControl('');
  tableData: any = [];
  dataBusy: boolean = false;
  constructor(
    public dataService: DataService,
    private matDialog: MatDialog,
    private router: Router,
    private notifierService: NotifierService,
    private _userService: UserServiceService,
    private credService: CredentialsService,
    private authenticationService: AuthenticationService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.adminData();
    this.initializeColumns();
  }

  initializeColumns(): void {
    this.tableColumns = [
      {
        name: 'User name',
        dataKey: 'user_name',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Email',
        dataKey: 'email',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Role',
        dataKey: 'role',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Permission',
        dataKey: 'permission',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Created at',
        dataKey: 'created_at',
        position: 'left',
        isSortable: true,
      },
    ];
  }

  toggleStatus(data: any) {
    this.dataService.put(`/admin/toggle_active/${data.id}`, {}).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
        this.adminData();
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  adminData() {
    this.isLoading = true;
    this.dataService.get('/admin', adminUsers).subscribe(
      async (res: any) => {
        console.log(res);
        this.tableData = res;
        this.isLoading = false;
      },
      (error) => {
        this.tableData = [];
        this.isLoading = false;
      }
    );
  }

  validateArrayLength(data: any) {
    return !data.length ? false : true;
  }

  export() {
    this.dataBusy = true;
    this.dataService.filters.limit = -1;
    this.dataService.filters.offset = 0;
    this.dataService.get('/admin', adminUsers).subscribe(
      (res: any) => {
        if (!this.validateArrayLength(res.data)) {
          this.notifierService.notify('error', 'No data available to download');
          this.dataBusy = false;
          this.dataService.filters.limit = 5;
          return 0;
        }
        var permissions = res.data.map((item: any) => {
          return _.map(item?.permission, 'name')?.join(',');
        });

        res.data.forEach((elem: any, i: any) => {
          elem.permissions = permissions[i];
        });
        AppConstants.Instance.downloadExcel(res.data, 'admins');
        this.dataBusy = false;
        this.dataService.filters.limit = 5;
      },
      (error) => {
        this.dataService.filters.limit = 5;
        this.dataBusy = false;
      }
    );
  }

  edit(data: any) {
    this.dataService.setSelectedData(data);
    this.router.navigate(['/admin-management/add-admin'], {
      queryParams: { type: 'Edit', id: data.id },
    });
  }

  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && (result.event == 'done' || result.event == 'deleted')) {
        let admindata: any = data;
        if (admindata.firebase_key) {
          this._userService.deleteAdmin(admindata.firebase_key);
        }
        let credentials: any = this.credService.credentials;
        if (admindata.id == credentials.id) {
          this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
        }
        this.adminData();
      }
      if (result && result.event == 'closed') {
        console.log('confirmed');
      }
    });
  }

  ngOnDestroy() {
    this.dataService.filters.offset = 0;
    this.dataService.filters.limit = 5;
    this.dataService.filters.search = '';
    this.dataService.filters.sortParams.key = '';
    this.dataService.filters.sortParams.order = 'desc';
  }
}
