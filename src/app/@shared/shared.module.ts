import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
/* Import the module*/
import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';

import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { DeleteComponent } from './modals/components/delete/delete.component';
import { AddNewComponent } from './modals/components/add-new/add-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableComponent } from './components/datatable/datatable.component';
import { DataPropertyGetterPipe } from './components/data-property-getter-pipe/data-property-getter-pipe.pipe';
import { UserDetailComponent } from './modals/components/user-detail/user-detail.component';
import { AddPayoutComponent } from './modals/components/add-payout/add-payout.component';
import { AddFaqComponent } from './modals/components/add-faq/add-faq.component';
import { SetCommissionComponent } from './modals/components/set-commission/set-commission.component';
import { WorkoutTypeComponent } from './modals/components/workout-type/workout-type.component';
import { CoachDetailComponent } from './modals/components/coach-detail/coach-detail.component';
import { SearchFilterPipe, TruncateStringPipe } from './pipes/custom.pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from 'ckeditor4-angular';
import { Permission } from '@app/auth/permission.service';
import { ArrangeCoachesComponent } from './modals/components/arrange-coaches/arrange-coaches.component';
import { ViewPdfComponent } from './modals/components/view-pdf/view-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BlobModule } from 'angular-azure-blob-service';

import {
  azureBlobStorageFactory,
  BLOB_STORAGE_TOKEN,
} from './services/azure-services/token';

import { TickComponent } from './modals/components/tick/tick.component';
@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    NgMaterialMultilevelMenuModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CKEditorModule,
    PdfViewerModule,
    BlobModule.forRoot(),
  ],
  declarations: [
    LoaderComponent,
    DeleteComponent,
    AddNewComponent,
    DatatableComponent,
    DataPropertyGetterPipe,
    UserDetailComponent,
    AddPayoutComponent,
    AddFaqComponent,
    SetCommissionComponent,
    WorkoutTypeComponent,
    CoachDetailComponent,
    TruncateStringPipe,
    SearchFilterPipe,
    ArrangeCoachesComponent,
    ViewPdfComponent,
    TickComponent,
  ],
  exports: [
    LoaderComponent,
    DatatableComponent,
    DataPropertyGetterPipe,
    TruncateStringPipe,
    SearchFilterPipe,
  ],
  entryComponents: [
    DeleteComponent,
    AddNewComponent,
    DatatableComponent,
    DataPropertyGetterPipe,
  ],
  providers: [
    Permission,
    {
      provide: BLOB_STORAGE_TOKEN,
      useFactory: azureBlobStorageFactory,
    },
  ],
})
export class SharedModule {}
