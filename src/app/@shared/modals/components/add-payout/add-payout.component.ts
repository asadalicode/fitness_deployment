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
import {
  BlobService,
  UploadConfig,
  UploadParams,
} from 'angular-azure-blob-service';
import { environment } from '@env/environment';
@Component({
  selector: 'app-add-payout',
  templateUrl: './add-payout.component.html',
  styleUrls: ['./add-payout.component.scss'],
})
export class AddPayoutComponent implements OnInit {
  isLoading: boolean = false;
  Form!: FormGroup;
  dataModel: any = {};
  data: any = {};
  CountryCodes$: Observable<any>;
  usersList: any;
  imgURL: string | ArrayBuffer;
  component: string;
  fileUploading = false;
  config: any = {};
  Config: UploadParams = environment.Config;
  percent: number = 0;
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<AddPayoutComponent>,
    private blob: BlobService,

    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    this.createForm();
    this.getAllUsers();
  }
  ngOnInit(): void {
    this.component = this.dataObject.fromComponent;
    console.log(this.component);
    switch (this.component) {
      case 'PayoutsUpdate':
        this.editPayout();
        break;

      default: {
        break;
      }
    }
  }
  private createForm() {
    this.Form = this.formBuilder.group({
      id: '',
      last_statement_date: ['', Validators.required],
      total_subscribers: ['', Validators.required],
      coach_id: ['', Validators.required],
      amount: ['', Validators.required],
      total_coach_share: ['', Validators.required],
      statement_pdf: ['', Validators.required],
    });
  }

  updateFormValues(data: any) {
    console.log('dataaaaa', data);
    this.Form.patchValue(data);
    this.Form.patchValue({
      last_statement_date: new Date(data.last_statement_date),
    });
  }

  touch() {
    this.Form.controls.statement_pdf.markAsTouched();
  }

  upload(event: any) {
    if (event.target.files.length === 0) return;
    const files = event.target.files;
    this.fileUploading = true;
    const baseUrl = this.blob.generateBlobUrl(this.Config, files[0].name);
    this.Form.patchValue({
      statement_pdf: files[0].name + environment.sasContainerUrl,
    });

    this.config = {
      baseUrl: baseUrl,
      sasToken: this.Config.sas,
      blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
      file: event.target.files[0],
      complete: () => {
        console.log('Transfer completed !');
        this.fileUploading = false;
      },

      error: (err: any) => {
        console.log('Error:', err);
      },
      progress: (percent: any) => {
        console.log(percent);
        this.percent = percent;
      },
    };
    this.uploadFile();
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

  uploadFile() {
    this.blob.upload(this.config);
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

  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'Payouts':
        this.addPayout();
        break;
      case 'PayoutsUpdate':
        this.addUpdatedPayout();
        break;

      default: {
        break;
      }
    }
  }

  addPayout() {
    this.touch();
    if (!this.Form.valid) return 0;
    console.log('form', this.Form.value);
    if (!this.fileUploading) {
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
  }

  addUpdatedPayout() {
    this.isLoading = true;
    this.dataService
      .postFormData('/payout/updatePayout', this.Form.value)
      .subscribe(
        (res: any) => {
          this.notifierService.notify('success', 'Payout Updated successfully');
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

  editPayout() {
    this.updateFormValues(this.dataObject.data.data);
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
