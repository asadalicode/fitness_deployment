import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  dataModel: any = {};
  data: any = {};
  isLoading: boolean = false;
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,

    private dataService: DataService,

    public dialogRef: MatDialogRef<DeleteComponent>,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {}
  ngOnInit(): void {
    this.dataModel = this.dataObject.data.data;
    this.data = this.dataObject;
    console.log(this.data);
  }
  closeModal() {
    this.dialogRef.close({ event: 'done' });
  }

  closeDeleteModal() {
    this.dialogRef.close({ event: 'deleted' });
  }
  close() {
    this.dialogRef.close({ event: 'close' });
  }
  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log('component', component);
    switch (component) {
      case 'AdminManagementComponent':
        this.deleteAdmin();
        break;

      case 'ReportsComponent':
        this.deleteReport();
        break;

      case 'NotificationComponent':
        this.deleteNotification();
        break;

      case 'FaqsComponent':
        this.deleteFaq();
        break;

      case 'PayoutComponent':
        this.deletePayout();
        break;
      default: {
        break;
      }
    }
  }

  deleteFaq() {
    this.isLoading = true;
    let url = `/frequent_questions/${this.dataModel.id}`;
    this.dataService.delete(url).subscribe(
      (res: any) => {
        this.notifierService.notify('success', res.message);
        this.closeModal();
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

  deletePayout() {
    console.log('deleteId', this.dataModel.id);
    this.isLoading = true;
    let url = `/payout/${this.dataModel.id}`;
    this.dataService.delete(url).subscribe(
      (res: any) => {
        this.notifierService.notify('success', res.message);
        this.closeModal();
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

  deleteAdmin() {
    this.isLoading = true;
    let url = `/admin/${this.dataModel.id}`;
    this.dataService.delete(url).subscribe(
      (res: any) => {
        this.notifierService.notify('success', res.message);
        this.closeDeleteModal();

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

  deleteReport() {
    this.isLoading = true;
    let url = `/query_report/${this.dataModel.id}`;
    this.dataService.delete(url).subscribe(
      (res: any) => {
        this.notifierService.notify('success', res.message);
        this.closeModal();
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

  deleteNotification() {
    this.isLoading = true;
    let url = `/notification/${this.dataModel.id}`;
    this.dataService.delete(url).subscribe(
      (res: any) => {
        this.notifierService.notify('success', res.message);
        this.closeModal();
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
}
