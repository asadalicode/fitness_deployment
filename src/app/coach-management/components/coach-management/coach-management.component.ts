import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { TickComponent } from '@app/@shared/modals/components/tick/tick.component';
import * as xlsx from 'xlsx';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { UserDetailComponent } from '@app/@shared/modals/components/user-detail/user-detail.component';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SetCommissionComponent } from '@app/@shared/modals/components/set-commission/set-commission.component';
import { WorkoutTypeComponent } from '@app/@shared/modals/components/workout-type/workout-type.component';
import { CoachDetailComponent } from '@app/@shared/modals/components/coach-detail/coach-detail.component';
import { Coaches } from '@app/@shared/Models/coaches';
import { NotifierService } from 'angular-notifier';
import { AppConstants } from '@app/@shared/constants/app-constants';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ArrangeCoachesComponent } from '@app/@shared/modals/components/arrange-coaches/arrange-coaches.component';

@Component({
  selector: 'app-coach-management',
  templateUrl: './coach-management.component.html',
  styleUrls: ['./coach-management.component.scss'],
})
export class CoachManagementComponent implements AfterViewInit {
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
  CoachDetailComponent = CoachDetailComponent;
  ArrangeCoachesComponent = ArrangeCoachesComponent;
  SetCommissionComponent = SetCommissionComponent;
  WorkoutTypeComponent = WorkoutTypeComponent;
  TickComponent = TickComponent;

  searchString = new FormControl('');
  tableData: any = [];
  dataBusy: boolean = false;
  matrixDetail: any = {};
  constructor(
    public dataService: DataService,
    private matDialog: MatDialog,
    private router: Router,
    private notifierService: NotifierService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.coaches();
    this.initializeColumns();
    this.getMatrixDetails();
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
      {
        name: 'Workout program type',
        dataKey: 'program_type',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Subscription Fees',
        dataKey: 'subscription_fee',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Commission Percentage',
        dataKey: 'commission_percentage',
        position: 'left',
        isSortable: false,
      },
    ];
  }

  coaches() {
    this.isLoading = true;
    this.dataService.get('/coach', Coaches).subscribe(
      async (res: any) => {
        this.tableData = res;
        console.log('tabledata', this.tableData.data);
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
    this.dataService.get('/coach', Coaches).subscribe(
      (res: any) => {
        if (!this.validateArrayLength(res.data)) {
          this.notifierService.notify('error', 'No data available to download');
          this.dataBusy = false;
          this.dataService.filters.limit = 5;
          return 0;
        }
        AppConstants.Instance.downloadExcel(res.data, 'coaches');
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
    this.router.navigate(['/coach-management/edit-coach'], {
      queryParams: { type: 'Edit', id: data.id },
    });
  }

  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event == 'done') {
        this.coaches();
        this.getMatrixDetails();
      }
      if (result && result.event == 'closed') {
        console.log('confirmed');
      }
    });
  }

  toggleStatus(data: any) {
    this.dataService.put(`/coach/toggle_active/${data.id}`, {}).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
        this.coaches();
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  toggleDefaultComissionStatus(event: MatSlideToggleChange) {
    let body = {
      status: event.checked ? 'active' : 'inactive',
    };
    this.dataService.put(`/coach/activate_default_comission`, body).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Updated successfully');
        this.coaches();
        this.getMatrixDetails();
      },
      (error) => {
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  getMatrixDetails() {
    this.dataService.getForTestingMatrix('/user/get_matrix?matrix=default_comission').subscribe((res: any) => {
      this.matrixDetail = res.data[0];
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
