import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-workout-type',
  templateUrl: './workout-type.component.html',
  styleUrls: ['./workout-type.component.scss'],
})
export class WorkoutTypeComponent implements OnInit {
  isLoading: boolean = false;
  Form!: FormGroup;
  dataModel: any = {};
  data: any = {};

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<WorkoutTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    this.createForm();
  }
  ngOnInit(): void {}
  private createForm() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      name_arabic: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'CoachManagement':
        this.addWorkoutType();
        break;

      default: {
        break;
      }
    }
  }
  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  addWorkoutType() {
    this.isLoading = true;
    this.dataService.patch('/coach/add_new_workout_program_type', this.Form.value).subscribe(
      (res: any) => {
        this.notifierService.notify('success', 'Workout type added successfully');
        this.closeModal();
      },
      (error: any) => {
        this.isLoading = false;
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }
  // addWorkoutType() {
  //   this.isLoading = true;
  //   this.dataService.patch('/coach/add_new_workout_program_type', this.Form.value).subscribe(
  //     (res: any) => {
  //       this.notifierService.notify('success', 'Workout type added successfully');
  //       this.closeModal();
  //     },
  //     (error: any) => {
  //       this.isLoading = false;
  //       if (error?.error?.error) {
  //         this.notifierService.notify('error', error.error.message);
  //       } else this.notifierService.notify('error', 'Something went wrong');
  //     }
  //   );
  // }
  closeModal() {
    this.dialogRef.close({ event: 'done' });
  }
  close() {
    this.dialogRef.close({ event: 'close' });
  }
}
