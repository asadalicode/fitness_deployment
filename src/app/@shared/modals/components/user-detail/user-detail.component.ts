import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  view: boolean = true;
  dataModel: any = {};
  data: any = {};
  serverUrl: string;

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {}
  ngOnInit(): void {
    this.dataModel = this.dataObject.data.data;

    this.data = this.dataObject;
    console.log(this.data);
    this.serverUrl = environment.serverUrl + '/';
  }
  closeModal() {
    this.dialogRef.close({ event: 'done' });
  }
  close() {
    this.dialogRef.close({ event: 'close' });
  }
  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    switch (component) {
      case 'UserManagementComponent':
        break;
      case 'AdminManagementComponent':
        break;

      default: {
        break;
      }
    }
  }
}
