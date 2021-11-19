import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '@app/@shared/services/data.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { Router } from '@angular/router';
import { AddPayoutComponent } from '@app/@shared/modals/components/add-payout/add-payout.component';
import { NotifierService } from 'angular-notifier';
import { ViewPdfComponent } from '@app/@shared/modals/components/view-pdf/view-pdf.component';

export interface TableColumn {
  name: string; // column name
  dataKey: string; // name of key of the actual data in this column
  position?: 'right' | 'left'; // should it be right-aligned or left-aligned?
  isSortable?: boolean; // can a column be sorted?
}

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit {
  popupRef = new PopupModal(this.matDialog);
  isLoading: boolean = false;
  ViewPdfComponent = ViewPdfComponent;
  public tableDataSource = new MatTableDataSource([]);
  public displayedColumns: string[];
  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild('editor', { static: false }) public editor: ElementRef;
  @Input() isPageable = false;
  @Input() isViewIcon = false;
  @Input() isDeleteIcon = false;
  @Input() isTickIcon = false;
  @Input() isCrossIcon = false;

  @Input() isEditIcon = false;
  @Input() isToggleIcon = false;
  @Input() isUploadIcon = false;
  @Input() isViewPdfIcon = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns: TableColumn[];
  @Input() rowActionIcon: string;
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() reloadTable: EventEmitter<any> = new EventEmitter();
  @Output() rowDeleteAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowEditAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowTickAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowCrossAction: EventEmitter<any> = new EventEmitter<any>();

  @Output() rowToggleAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowToggleResolveAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowUploadAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowViewPdfAction: EventEmitter<any> = new EventEmitter<any>();

  @Output() pdfFile: EventEmitter<any> = new EventEmitter<any>();

  @Output() rowViewAction: EventEmitter<any> = new EventEmitter<any>();
  totalRecords: any = {};
  public searchSub$ = new Subject<string>();
  constructor(
    private dataService: DataService,
    private matDialog: MatDialog,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    const columnNames = this.tableColumns.map((tableColumn: TableColumn) => tableColumn.name);
    if (this.rowActionIcon) {
      this.displayedColumns = [...columnNames, this.rowActionIcon];
    } else {
      this.displayedColumns = columnNames;
    }

    this.searchData();
  }

  @Input() set tableData(data: any) {
    this.totalRecords = data;
    if (data) this.setTableDataSource(data);
  }

  @Input() set searchValue(elem: any) {
    this.searchSub$.next(elem);
  }

  searchData() {
    this.searchSub$.pipe(debounceTime(400), distinctUntilChanged()).subscribe((filterValue: string) => {
      let value = filterValue.trim().toLowerCase();
      this.dataService.filters.search = value;
      this.reloadTable.next();
    });
  }

  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    if (this.tableDataSource) this.tableDataSource.paginator = this.matPaginator;
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data.data);
    // this.tableDataSource.paginator = this.matPaginator;
    // this.tableDataSource.sort = this.matSort;
    // this.tableDataSource.paginator = this.matPaginator;
  }

  applyFilter(searchValue: string) {
    const filterValue = searchValue;
    this.tableDataSource.filter = filterValue;
    filterValue.trim().toLowerCase();
    this.dataService.filters.search = filterValue;
    // this.reloadTable.emit();
  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    let keyName = sortParameters.active;
    sortParameters.active = this.tableColumns.find((column) => column.name === sortParameters.active).dataKey;
    this.dataService.filters.sortParams.key = keyName;
    this.dataService.filters.sortParams.order = sortParameters.direction;
    if (sortParameters.direction === 'asc') {
      this.reloadTable.emit();
    } else if (sortParameters.direction === 'desc') {
      this.reloadTable.emit();
    }

    // this.sort.emit(sortParameters);
  }

  //Specifically for converting date to a format inside dataTable
  convert(element: any) {
    element.date_of_upload = moment(new Date(element.date_of_upload)).format('l, LT');
    element.date_of_operation = moment(new Date(element.date_of_upload)).format('l, LT');
    element.created_at = moment(new Date(element.created_at)).format('l, LT');
    element.last_statement_date = moment(new Date(element.last_statement_date)).format('l');

    return element;
  }

  setPage(index: any) {
    this.dataService.filters.offset = index.pageIndex;
    this.dataService.filters.limit = index.pageSize;
    this.reloadTable.emit();
  }

  emitDeleteRowAction(row: any) {
    this.rowDeleteAction.emit(row);
  }

  emitEditRowAction(row: any) {
    this.rowEditAction.emit(row);
  }
  emitTickRowAction(row: any) {
    this.rowTickAction.emit(row);
  }
  emitCrossRowAction(row: any) {
    this.rowCrossAction.emit(row);
  }

  emitToggleAction(row: any) {
    this.rowToggleAction.emit(row);
  }

  toggleResolveStatus(row: any) {
    this.rowToggleResolveAction.emit(row);
  }

  emitViewRowAction(row: any) {
    this.rowViewAction.emit(row);
  }
  emitViewPdfRowAction(row: any) {
    this.rowViewAction.emit(row);
  }
  emitUploadRowAction(row: any) {
    this.rowUploadAction.emit(row);
  }

  emitViewPdfAction(row: any) {
    this.rowViewPdfAction.emit(row);
  }

  upload(event: any) {
    if (event.target.files.length === 0) return;
    const files = event.target.files;
    this.pdfFile.emit(files);

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {};
  }
  openItemModal(type: string, component: any, data?: {}, fromComponent?: string) {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal(type, component, { data: data }, fromComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      // if (result && result.event == 'done') {
      //   this.payouts();
      // }
      if (result && result.event == 'closed') {
        console.log('confirmed');
      }
    });
  }
}
