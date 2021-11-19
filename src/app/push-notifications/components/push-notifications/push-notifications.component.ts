import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Notifications } from '@app/@shared/Models/notifications';
import { AppConstants } from '@app/@shared/constants/app-constants';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss'],
})
export class PushNotificationsComponent implements AfterViewInit {
  tableColumns: {
    name: string;
    dataKey: string;
    position: string;
    isSortable: boolean;
  }[];
  popupRef = new PopupModal(this.matDialog);
  isLoading: boolean = false;
  DeleteComponent = DeleteComponent;
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
    this.notifications();
    this.initializeColumns();
  }
  initializeColumns(): void {
    this.tableColumns = [
      {
        name: 'Title(English)',
        dataKey: 'title',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Title(Arabic)',
        dataKey: 'title_arabic',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Message (English)',
        dataKey: 'message',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Message (Arabic)',
        dataKey: 'message_arabic',
        position: 'left',
        isSortable: true,
      },
    ];
  }

  notifications() {
    this.isLoading = true;
    this.dataService.get('/notification', Notifications).subscribe(
      async (res: any) => {
        this.tableData = res;
        console.log(this.tableData);
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
    this.router.navigate(['/push-notifications/add-new-notification'], {
      queryParams: { type: 'Edit', id: data.id },
    });
  }

  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event == 'done') {
        this.notifications();
      }
      if (result && result.event == 'closed') {
        console.log('confirmed');
      }
    });
  }

  validateArrayLength(data: any) {
    return !data.length ? false : true;
  }

  export() {
    this.dataBusy = true;
    this.dataService.filters.limit = -1;
    this.dataService.filters.offset = 0;
    this.dataService.get('/notification', Notifications).subscribe(
      (res: any) => {
        if (!this.validateArrayLength(res.data)) {
          this.notifierService.notify('error', 'No data available to download');
          this.dataBusy = false;
          this.dataService.filters.limit = 5;
          return 0;
        }
        AppConstants.Instance.downloadExcel(res.data, 'notifications');
        this.dataBusy = false;
        this.dataService.filters.limit = 5;
      },
      (error) => {
        this.dataService.filters.limit = 5;
        this.dataBusy = false;
      }
    );
  }

  ngOnDestroy() {
    this.dataService.filters.offset = 0;
    this.dataService.filters.limit = 5;
    this.dataService.filters.search = '';
    this.dataService.filters.sortParams.key = '';
    this.dataService.filters.sortParams.order = 'desc';
  }
}
