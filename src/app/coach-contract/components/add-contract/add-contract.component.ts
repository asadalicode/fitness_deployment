import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contract } from '@app/@shared/Models/contract';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss'],
})
export class AddContractComponent implements OnInit {
  Form!: FormGroup;
  isLoading: boolean = false;
  constructor(private fb: FormBuilder, private dataService: DataService, private notifierService: NotifierService) {
    this.createForm();
  }

  updateFormValues(data: any) {
    this.Form.patchValue({
      coach_contract_english: data[0]?.coach_contract_english,
      coach_contract_arabic: data[0]?.coach_contract_arabic,
    });
  }

  ngOnInit(): void {
    this.getContract();
  }

  getContract() {
    this.dataService.getSingle('/coach_contract', Contract).subscribe((res: any) => {
      this.updateFormValues(res);
    });
  }

  private createForm() {
    this.Form = this.fb.group({
      coach_contract_english: ['', [Validators.required]],
      coach_contract_arabic: ['', [Validators.required]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  submit() {
    this.isLoading = true;
    let data = {
      english_text: this.Form.value.coach_contract_english,
      arabic_text: this.Form.value.coach_contract_arabic,
    };
    this.dataService.put('/coach_contract', data).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.notifierService.notify('success', 'Contract updated successfully');
      },
      (error) => {
        this.isLoading = false;
        if (error.error.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Oops! Something went wrong');
      }
    );
  }
}
