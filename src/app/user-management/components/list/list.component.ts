import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { UserDetailComponent } from '@app/@shared/modals/components/user-detail/user-detail.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '@app/@shared/Models/index';
import { NotifierService } from 'angular-notifier';
import { AppConstants } from '@app/@shared/constants/app-constants';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
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
    private notifierService: NotifierService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.userData();
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
        name: 'First name',
        dataKey: 'first_name',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Last name',
        dataKey: 'last_name',
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
        name: 'Gender',
        dataKey: 'gender',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Country',
        dataKey: 'country',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Phone Number',
        dataKey: 'phone_number',
        position: 'left',
        isSortable: true,
      },
    ];
  }

  userData() {
    this.isLoading = true;
    this.dataService.get('/user', Users).subscribe(
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

  edit(data: any) {
    this.dataService.setSelectedData(data);
    this.router.navigate(['/user-management/edit-user'], {
      queryParams: { type: 'Edit', id: data.id },
    });
  }

  toggleStatus(data: any) {
    this.dataService.put(`/user/toggle_active/${data.id}`, {}).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
        this.userData();
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
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
    this.dataService.get('/user', Users).subscribe(
      (res: any) => {
        if (!this.validateArrayLength(res.data)) {
          this.notifierService.notify('error', 'No data available to download');
          this.dataBusy = false;
          this.dataService.filters.limit = 5;
          return 0;
        }
        AppConstants.Instance.downloadExcel(res.data, 'users');
        this.dataBusy = false;
        this.dataService.filters.limit = 5;
      },
      (error) => {
        this.dataService.filters.limit = 5;
        this.dataBusy = false;
      }
    );
  }

  openModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    this.dataService.setSelectedData(data);
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event == 'added') {
      }
      if (result && result.event == 'closed') {
        console.log('confirmed');
      }
    });
  }

  ngOnDestroy() {
    this.dataService.filters.offset = 0;
    this.dataService.filters.search = '';
    this.dataService.filters.limit = 5;
    this.dataService.filters.sortParams.key = '';
    this.dataService.filters.sortParams.order = 'desc';
  }
}
