import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Coaches } from '@app/@shared/Models/coaches';

@Component({
  selector: 'app-arrange-coaches',
  templateUrl: './arrange-coaches.component.html',
  styleUrls: ['./arrange-coaches.component.scss'],
})
export class ArrangeCoachesComponent implements OnInit {
  isLoading: boolean = false;
  Form!: FormGroup;
  error: string | undefined;
  dataModel: any = {};
  data: any = {};
  coachList: Coaches[];
  ArrangeCoach: any = [];
  isBusy = false;

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<ArrangeCoachesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    this.getAllCoaches();
  }
  ngOnInit(): void {}

  getAllCoaches() {
    this.isBusy = true;
    this.dataService.filters.limit = -1;
    this.dataService.get('/coach', Coaches).subscribe(
      async (res: any) => {
        this.coachList = res.data;
        this.dataService.filters.limit = 5;
        this.isBusy = false;
      },
      (error) => {
        this.isBusy = false;
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.coachList, event.previousIndex, event.currentIndex);

    console.log(this.coachList);
  }

  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'CoachManagementComponent':
        this.submitCoaches();
        break;

      default: {
        break;
      }
    }
  }

  submitCoaches() {
    this.coachList.forEach((res: any, index: any) => {
      return (res.position = index);
    });

    if (this.ArrangeCoach.length != 0) {
      this.ArrangeCoach = [];
    }
    this.coachList.map((x: any) => {
      this.ArrangeCoach.push({ id: x.id, position: x.position });
    });

    this.dataService.put('/user/updateCoachPosition', this.ArrangeCoach).subscribe(
      (res: any) => {
        this.closeModal();
      },
      (error) => {
        console.log(error.message, 'something went wrong');
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
