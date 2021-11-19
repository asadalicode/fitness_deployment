import { UserDetailComponent } from '@app/@shared/modals/components/user-detail/user-detail.component';
import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { AddPayoutComponent } from '@app/@shared/modals/components/add-payout/add-payout.component';
import * as xlsx from 'xlsx';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Payouts } from '@app/@shared/Models/payouts';
import { NotifierService } from 'angular-notifier';
import { AppConstants } from '@app/@shared/constants/app-constants';
import * as moment from 'moment';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { ViewPdfComponent } from '@app/@shared/modals/components/view-pdf/view-pdf.component';

export interface BulkPayout {
  user_name: string;
  last_statement_date: Date;
  total_subscribers: number;
  total_coach_share: number;
  amount: number;
}

@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss'],
})
export class PayoutsComponent implements AfterViewInit {
  tableColumns: {
    name: string;
    dataKey: string;
    position: string;
    isSortable: boolean;
  }[];
  dataBusy: boolean = false;
  popupRef = new PopupModal(this.matDialog);
  isLoading: boolean = false;
  AddPayoutComponent = AddPayoutComponent;
  UserDetailComponent = UserDetailComponent;
  DeleteComponent = DeleteComponent;
  searchString = new FormControl('');
  tableData: any = [];
  pdfFile: any;
  setRowValues: any;
  constructor(
    public dataService: DataService,
    private matDialog: MatDialog,
    private router: Router,
    private notifierService: NotifierService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.payouts();
    this.initializeColumns();
  }

  initializeColumns(): void {
    this.tableColumns = [
      {
        name: 'Coach Username',
        dataKey: 'coach_user_name',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Last Statment Date',
        dataKey: 'last_statement_date',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Total Subscribers',
        dataKey: 'total_subscribers',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Total Coach Share',
        dataKey: 'total_coach_share',
        position: 'left',
        isSortable: true,
      },
    ];
  }

  payouts() {
    this.isLoading = true;
    this.dataService.get('/payout/listPayout', Payouts).subscribe(
      async (res: any) => {
        console.log('payout', res);
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
    this.openItemModal('add-payout', AddPayoutComponent, data, 'PayoutsUpdate');

    // this.router.navigate(['/admin-management/add-admin'], {
    //   queryParams: { type: 'Edit', id: data.id },
    // });
  }

  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event == 'done') {
        this.payouts();
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
    this.dataService.get('/payout/listPayout', Payouts).subscribe(
      (res: any) => {
        if (!this.validateArrayLength(res.data)) {
          this.notifierService.notify('error', 'No data available to download');
          this.dataBusy = false;
          this.dataService.filters.limit = 5;
          return 0;
        }
        AppConstants.Instance.downloadExcel(res.data, 'payouts');
        this.dataBusy = false;
        this.dataService.filters.limit = 5;
      },
      (error) => {
        this.dataService.filters.limit = 5;
        this.dataBusy = false;
      }
    );
  }

  async importExcel(e: any) {
    let excelData: any = await AppConstants.Instance.importExcel(e);
    let postData = {
      payouts: excelData,
    };
    this.dataService.post('/payout/insertPayoutsInBulk', postData).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Bulk insertion successfull');
        this.payouts();
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
    console.log(excelData);
  }

  upload(event: any) {
    this.pdfFile = event[0];
    console.log(event);
    this.openItemModal('view-pdf', ViewPdfComponent, event, 'Payouts');
    // this.uploadPdf(this.setRowValues);
  }

  setRowClick(e: any) {
    this.setRowValues = e;
  }

  // uploadPdf(e: any) {
  //   let share = e.total_coach_share.slice(1);
  //   e.total_coach_share = share;
  //   let data = {
  //     last_statement_date: moment(e.last_statement_date).toDate(),
  //     total_subscribers: e.total_subscribers,
  //     coach_id: e.coach_id,
  //     amount: Number(e.amount),
  //     total_coach_share: share,
  //     statement_pdf: this.pdfFile,
  //   };
  //   this.addPayout(data);
  // }

  addPayout(form: any) {
    this.isLoading = true;
    this.dataService.postFormData('/payout/addPayout', form).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Pdf uploaded successfully');
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

  ngOnDestroy() {
    this.dataService.filters.offset = 0;
    this.dataService.filters.search = '';
    this.dataService.filters.limit = 5;
  }
}
