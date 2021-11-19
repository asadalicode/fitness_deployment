import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss'],
})
export class AddFaqComponent implements OnInit {
  socities: any = [];
  isLoading: boolean = false;
  Form!: FormGroup;
  error: string | undefined;
  isSocietyLayout = false;
  edit: boolean = true;
  dataModel: any = {};
  data: any = {};
  countries: Country[] = [
    { value: 'option-0', viewValue: 'Option 1' },
    { value: 'option-1', viewValue: 'Option 2' },
    { value: 'option-2', viewValue: 'Option 3' },
  ];

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<AddFaqComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    console.log(this.dataObject);
  }
  private createForm() {
    this.Form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }

  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'Faqs':
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
