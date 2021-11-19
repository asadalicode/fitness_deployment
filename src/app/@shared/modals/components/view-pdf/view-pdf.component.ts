import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { Observable, of } from 'rxjs';
import { CountryNames } from '@app/@shared/Models/countryNames';
import { Users } from '@app/@shared/Models/users';
import { AddPayoutComponent } from '../add-payout/add-payout.component';
import { Pdf } from '@app/@shared/Models/pdf';
import { Payouts } from '@app/@shared/Models/payouts';
import { environment } from '@env/environment';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss'],
})
export class ViewPdfComponent implements OnInit {
  isLoading: boolean = false;
  Form!: FormGroup;
  dataModel: any = {};
  data: any = {};
  CountryCodes$: Observable<any>;
  usersList: any;
  imgURL: string | ArrayBuffer;
  pdfSrc = '';
  id: number;
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<AddPayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    this.createForm();
    this.getAllUsers();
    this.getPdf();
  }
  ngOnInit(): void {}
  private createForm() {
    this.Form = this.formBuilder.group({
      last_statement_date: ['', Validators.required],
      total_subscribers: ['', Validators.required],
      coach_id: ['', Validators.required],
      amount: ['', Validators.required],
      total_coach_share: ['', Validators.required],
      statement_pdf: ['', Validators.required],
    });
  }

  touch() {
    this.Form.controls.statement_pdf.markAsTouched();
  }

  upload(event: any) {
    if (event.target.files.length === 0) return;
    const files = event.target.files;
    this.Form.patchValue({
      statement_pdf: files[0],
    });
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  getAllUsers() {
    this.dataService
      .get_WithoutCount('/notification/get_all_users', Users)
      .subscribe(
        async (res: any) => {
          console.log(res);
          this.usersList = res;
        },
        (error) => {}
      );
  }

  getPdf() {
    this.id = this.dataObject.data.data.id;
    console.log('userDetails', this.dataObject.data.data);
    this.dataService.get(`/payout/${this.id}`, Pdf).subscribe(
      (res: any) => {
        this.pdfSrc =
          environment.sasContainerUrl +
          '/' +
          res.data.pdf +
          environment.sasTokenUrl;
      },
      (error) => {
        this.notifierService.notify('error', 'Something went wrong');
        console.log(error);
      }
    );
  }
  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'Payouts':
        this.addPayout();
        break;

      default: {
        break;
      }
    }
  }

  addPayout() {
    this.touch();
    if (!this.Form.valid) return 0;

    this.isLoading = true;
    this.dataService
      .postFormData('/payout/addPayout', this.Form.value)
      .subscribe(
        (res: any) => {
          this.notifierService.notify('success', 'Payout added successfully');
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
