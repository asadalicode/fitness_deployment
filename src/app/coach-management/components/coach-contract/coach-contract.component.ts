import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@app/@shared/services/data.service';
import { of } from 'rxjs';
import { CoachDetail } from '@app/@shared/Models/CoachDetail';
import { data } from 'jquery';
import { Contract } from '@app/@shared/Models/contract';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Setting } from '@app/@shared/Models/Setting';
@Component({
  selector: 'app-coach-contract',
  templateUrl: './coach-contract.component.html',
  styleUrls: ['./coach-contract.component.scss'],
})
export class CoachContractComponent implements OnInit {
  date = new Date();

  Form!: FormGroup;
  htmlData: any;
  data: any;
  coach_contract: any;
  @ViewChild('htmlData', { static: false }) el!: ElementRef;
  isBusy: boolean;
  coachDetail$: any;

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public dataService: DataService,
    private router: Router
  ) {
    let id = route.snapshot.paramMap.get('id');
    this.createForm();
    this.getDetails(id);
    this.getContract();
    // this.openPDF();
  }

  ngOnInit(): void {
    //  this.openPDF()
  }

  // ngAfterViewInit() {
  //   this.openPDF()
  // }

  getDetails(id: any) {
    this.isBusy = true;
    this.dataService.get_WithoutCount(`/user/getUserById/${id}`, CoachDetail).subscribe(
      (res: any) => {
        this.coachDetail$ = of(res[0]);
        this.data = res[0];
        this.isBusy = false;
      },
      (error) => {
        this.isBusy = false;
        console.log('something went wrong');
      }
    );
  }

  updateFormValues(data: any) {
    this.Form.patchValue({
      coach_contract_eng: data?.coach_contract_english,
      coach_contract_arb: data?.coach_contract_arabic,
    });
  }

  private createForm() {
    this.Form = this.fb.group({
      coach_contract_eng: '',
      coach_contract_arb: '',
    });
  }
  getContract() {
    this.dataService.getSingle('/coach_contract', Contract).subscribe(
      async (res: any) => {
        let ress = await res[0];
        this.htmlData = ress.coach_contract_english;
        document.getElementById('contract').innerHTML = this.htmlData;
      },
      (error) => {
        console.log(error, 'Something went wrong');
      }
    );
  }

  public openPDF(): void {
    let DATA = document.getElementById('htmlData');

    html2canvas(DATA, { useCORS: true }).then((canvas) => {
      console.log(canvas);
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', [220, fileHeight + 200]);
      PDF.addImage(FILEURI, 'PNG', 0, 0, fileWidth, fileHeight);

      PDF.save('coach-contract.pdf');
      this.router.navigate(['/coach-management']);
    });

    // pdf.html(this.el.nativeElement, {
    //   callback: (pdf) => {
    //     pdf.save('coach-contract.pdf');
    //   },
    // });
    // this.router.navigate(['/coach-management']);
  }
}
