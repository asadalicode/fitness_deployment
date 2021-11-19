import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class AddNewComponent implements OnInit {
  isLoading: boolean = false;
  Form!: FormGroup;
  error: string | undefined;
  edit: boolean = true;
  dataModel: any = {};
  data: any = {};
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<AddNewComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    this.createForm();
  }
  ngOnInit(): void {}
  private createForm() {
    this.Form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }

  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'CategoryManagement':
        break;

      default: {
        break;
      }
    }
  }
  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };
  closeModal() {
    this.dialogRef.close({ event: 'done' });
  }
  close() {
    this.dialogRef.close({ event: 'close' });
  }
}
