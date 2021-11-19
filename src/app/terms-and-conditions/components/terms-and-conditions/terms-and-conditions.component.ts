import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { TermsConfitions } from '@app/@shared/Models/TermsConditions';
import { DataService } from './../../../@shared/services/data.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
  @ViewChild('editor') editor: ElementRef;
  popupRef = new PopupModal(this.matDialog);
  data: any = {};

  constructor(private matDialog: MatDialog, public dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.getTermsandConditions();
  }

  openItemModalTwo() {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal('delete', DeleteComponent);
  }

  getTermsandConditions() {
    this.dataService.getSingle('/terms_and_conditions', TermsConfitions).subscribe((res: any) => {
      this.data = res[0];
      console.log(res);
    });
  }

  edit(data: any) {
    this.dataService.setSelectedData(data);
    this.router.navigate(['/terms-and-conditions/update'], {
      queryParams: { type: 'Edit', id: data?.id },
    });
  }
}
