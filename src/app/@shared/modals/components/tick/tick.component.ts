import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-tick',
  templateUrl: './tick.component.html',
  styleUrls: ['./tick.component.scss'],
})
export class TickComponent implements OnInit {
  dataModel: any = {};
  data: any = {};
  userInfo: any = {};
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
    this.userInfo = this.dataObject.data.data;
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

  onTickSelect() {
    let data = {
      email: this.userInfo.email,
      first_name: this.userInfo.first_name,
      phone_number: this.userInfo.phone_number,
    };
    this.isLoading = true;
    this.dataService.put(`/user/${this.userInfo.id}`, data).subscribe(
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

  onCrossSelect() {
    let data = {
      email: this.userInfo.email,
      first_name: this.userInfo.first_name,
      phone_number: this.userInfo.phone_number,
      is_verified: 0,
    };
    this.isLoading = true;
    this.dataService.put(`/user/${this.userInfo.id}`, data).subscribe(
      (res: any) => {
        this.notifierService.notify('success', res.message);
        this.isLoading = false;
        this.closeModal();
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
