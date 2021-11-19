import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Coaches } from '@app/@shared/Models/coaches';

@Component({
  selector: 'app-set-commission',
  templateUrl: './set-commission.component.html',
  styleUrls: ['./set-commission.component.scss'],
})
export class SetCommissionComponent implements OnInit {
  isLoading: boolean = false;
  selectedTabIndex: number = 0;
  Form!: FormGroup;
  dataModel: any = {};
  data: any = {};
  dropdownSettings: IDropdownSettings;
  dropdownList: any = [];
  selectedItems: any = [];

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<SetCommissionComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObject: any
  ) {
    console.log(this.dataObject);

    this.createForm();
    if (this.dataObject.data) {
      this.updateFormValues(this.dataObject.data.data);
    }
    this.coaches();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'full_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false,
    };
  }
  ngOnInit(): void {}

  updateFormValues(data: any) {
    this.Form.patchValue({
      activate_default_comission: data?.status == 'active' ? true : false,
    });
  }

  onTabChanged(e: any) {
    console.log(this.selectedTabIndex);
    if (this.selectedTabIndex == 1) {
      this.Form.controls.coaches_ids.clearValidators();
      this.Form.controls.coaches_ids.updateValueAndValidity();
    } else {
      this.Form.controls.coaches_ids.setValidators(Validators.required);
      this.Form.controls.coaches_ids.updateValueAndValidity();
    }
  }

  coaches() {
    this.dataService.filters.limit = -1;
    this.dataService.get('/coach', Coaches).subscribe(
      async (res: any) => {
        console.log(res);
        this.dropdownList = res.data;
        this.dataService.filters.limit = 5;
      },
      (error) => {
        this.dataService.filters.limit = 5;
        this.dropdownList = [];
      }
    );
  }

  private createForm() {
    this.Form = this.formBuilder.group({
      comission: ['', [Validators.required, Validators.maxLength(50)]],
      coaches_ids: ['', [Validators.required]],
      activate_default_comission: [false],
    });
  }

  lookUpComponent() {
    let component = this.dataObject.fromComponent;
    console.log(component);

    switch (component) {
      case 'CoachManagement':
        this.setCustomComission();
        break;

      default: {
        break;
      }
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  setCustomComission() {
    this.isLoading = true;
    let result: any;
    if (this.selectedTabIndex == 0) result = this.Form.value.coaches_ids.map((a: any) => a.id);
    this.Form.value.coaches_ids = result;
    this.dataService
      .put(this.selectedTabIndex == 0 ? '/coach/set_custom_comission' : '/coach/set_default_comission', this.Form.value)
      .subscribe(
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
  closeModal() {
    this.dialogRef.close({ event: 'done' });
  }
  close() {
    this.dialogRef.close({ event: 'close' });
  }
}
