import { DataService } from './../../../@shared/services/data.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { AddFaqComponent } from '@app/@shared/modals/components/add-faq/add-faq.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Faqs } from '@app/@shared/Models/faqs';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements AfterViewInit {
  tableColumns: {
    name: string;
    dataKey: string;
    position: string;
    isSortable: boolean;
  }[];
  popupRef = new PopupModal(this.matDialog);
  isLoading: boolean = false;
  DeleteComponent = DeleteComponent;
  AddFaqComponent = AddFaqComponent;

  searchString = new FormControl('');
  tableData: any = [];
  dataBusy: boolean = false;

  constructor(
    public dataService: DataService,
    private matDialog: MatDialog,
    private router: Router,
    private notifierService: NotifierService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.faqs();
    this.initializeColumns();
  }

  initializeColumns(): void {
    this.tableColumns = [
      {
        name: 'ID',
        dataKey: 'id',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Question(English)',
        dataKey: 'question_en',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Question(Arabic)',
        dataKey: 'question_ar',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Answer(English)',
        dataKey: 'answer_en',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Answer(Arabic)',
        dataKey: 'answer_ar',
        position: 'left',
        isSortable: true,
      },
    ];
  }

  faqs() {
    this.isLoading = true;
    this.dataService.get('/frequent_questions/getAll', Faqs).subscribe(
      async (res: any) => {
        console.log(res);
        this.tableData = res;
        this.isLoading = false;
      },
      (error) => {
        this.tableData = [];
        this.isLoading = false;
      }
    );
  }

  edit(data: any) {
    console.log(data);
    this.dataService.setSelectedData(data);
    this.router.navigate(['/faqs/add-new'], {
      queryParams: { type: 'Edit', id: data.id },
    });
  }

  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event == 'done') {
        this.faqs();
      }
      if (result && result.event == 'closed') {
        console.log('confirmed');
      }
    });
  }
  ngOnDestroy() {
    this.dataService.filters.offset = 0;
    this.dataService.filters.search = '';
    this.dataService.filters.limit = 5;
    this.dataService.filters.sortParams.key = '';
    this.dataService.filters.sortParams.order = 'desc';
  }
}
