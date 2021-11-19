import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@app/@shared/services/data.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class AddNewComponent implements OnInit {
  isLoading: boolean = false;
  Form!: FormGroup;
  data: Subscription;
  faqData: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notifierService: NotifierService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.faqId) {
      this.getFaqsData();
    }
  }

  get faqId() {
    let id: string = '';
    this.route.queryParams.subscribe((res: any) => {
      id = res.id;
    });
    return id;
  }

  getFaqsData() {
    this.data = this.dataService.getSelectedData().subscribe((res: any) => {
      this.faqData = res;
      console.log(this.faqData);
      this.updateFormValues(this.faqData);
    });
  }

  updateFormValues(data: any) {
    this.Form.patchValue(data);
  }

  private createForm() {
    this.Form = this.formBuilder.group({
      question_en: ['', [Validators.required]],
      answer_en: ['', [Validators.required]],
      question_ar: ['', [Validators.required]],
      answer_ar: ['', [Validators.required]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  submit() {
    console.log(this.Form.value);
    this.isLoading = true;
    this.faqId ? this.updateFaq(this.faqId) : this.addFaq();
  }

  updateFaq(id: any) {
    this.Form.value.is_active = true;
    this.dataService.put(`/frequent_questions/${id}`, this.Form.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.notifierService.notify('success', 'Updated successfully');
        this.router.navigate(['/faqs']);
      },
      (error) => {
        this.isLoading = false;
        if (error?.error?.error) {
          this.notifierService.notify('error', error.error.message);
        } else this.notifierService.notify('error', 'Something went wrong');
      }
    );
  }

  addFaq() {
    this.Form.value.is_active = true;
    this.dataService.post(`/frequent_questions/`, this.Form.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.notifierService.notify('success', 'Updated successfully');
        this.router.navigate(['/faqs']);
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
