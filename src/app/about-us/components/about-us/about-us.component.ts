import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { aboutUs } from '@app/@shared/Models/aboutUs';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { TermsConfitions } from '@app/@shared/Models/TermsConditions';
import { DataService } from './../../../@shared/services/data.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  @ViewChild('editor') editor: ElementRef;
  popupRef = new PopupModal(this.matDialog);
  data: any = {};

  constructor(private matDialog: MatDialog, public dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.getAboutus();
  }

  openItemModalTwo() {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal('delete', DeleteComponent);
  }

  getAboutus() {
    this.dataService.getSingle('/about_us', aboutUs).subscribe((res: any) => {
      this.data = res[0];
    });
  }

  edit(data: any) {
    this.dataService.setSelectedData(data);
    this.router.navigate(['/about-us/update'], {
      queryParams: { type: 'Edit', id: data?.id },
    });
  }
}
