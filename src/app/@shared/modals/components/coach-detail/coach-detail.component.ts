import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { CoachDetail } from '@app/@shared/Models/CoachDetail';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.scss'],
})
export class CoachDetailComponent implements OnInit {
  view: boolean = true;
  isActive = true;
  dataModel: any = {};
  data: any = {};
  serverUrl: string;
  coachDetail$: Observable<any>;
  isBusy: boolean = false;
  isLoading: boolean;
  PdfGeneratedData: any = {};
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<CoachDetailComponent>,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {}
  ngOnInit(): void {
    this.dataModel = this.dataObject?.data;
    this.data = this.dataObject;
    this.serverUrl = environment.serverUrl + '/';
    this.getDetails(this.dataObject.data.id);
  }

  getDetails(id: any) {
    this.isBusy = true;
    this.dataService.get_WithoutCount(`/user/getUserById/${id}`, CoachDetail).subscribe(
      (res: any) => {
        console.log(res[0]);
        this.coachDetail$ = of(res[0]);
        this.isBusy = false;
      },
      (error) => {
        this.isBusy = false;
      }
    );
  }

  getCoachPdfDetails(id: any) {
    this.router.navigate(['/coach-management/coach-contract/', id]);
  }

  downloadContract(id: any) {
    this.getCoachPdfDetails(id);
    this.closeModal();
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
