import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import * as xlsx from 'xlsx';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Reports } from '@app/@shared/Models/query';
import { NotifierService } from 'angular-notifier';
import { AppConstants } from '@app/@shared/constants/app-constants';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss'],
})
export class ReportManagementComponent implements AfterViewInit {
  tableColumns: {
    name: string;
    dataKey: string;
    position: string;
    isSortable: boolean;
  }[];
  dataBusy: boolean = false;
  popupRef = new PopupModal(this.matDialog);
  isLoading: boolean = false;
  DeleteComponent = DeleteComponent;
  searchString = new FormControl('');
  tableData: any = [];

  constructor(
    public dataService: DataService,
    private matDialog: MatDialog,
    private notifierService: NotifierService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.reports();
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
        name: 'Phone Number',
        dataKey: 'phone_number',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Created at',
        dataKey: 'created_at',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Query',
        dataKey: 'query',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Status',
        dataKey: 'status',
        position: 'left',
        isSortable: true,
      },
    ];
  }

  reports() {
    this.isLoading = true;
    this.dataService.get('/query_report', Reports).subscribe(
      async (res: any) => {
        this.tableData = res;
        this.isLoading = false;
      },
      (error) => {
        this.tableData = [];
        this.isLoading = false;
      }
    );
  }

  toggleStatus(data: any) {
    this.dataService.put(`/query_report/toggle_resolve/${data.id}`, {}).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
        this.reports();
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
    this.dataService.get('/query_report', Reports).subscribe(
      (res: any) => {
        if (!this.validateArrayLength(res.data)) {
          this.notifierService.notify('error', 'No data available to download');
          this.dataBusy = false;
          this.dataService.filters.limit = 5;
          return 0;
        }
        AppConstants.Instance.downloadExcel(res.data, 'report');
        this.dataBusy = false;
        this.dataService.filters.limit = 5;
      },
      (error) => {
        this.dataService.filters.limit = 5;
        this.dataBusy = false;
      }
    );
  }

  edit(e: any) {}

  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event == 'done') {
        this.reports();
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
