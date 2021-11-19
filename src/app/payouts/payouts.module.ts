import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';

import { PayoutsRoutingModule } from './payouts-routing.module';
import { PayoutsComponent } from './components/payouts/payouts.component';

import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [PayoutsComponent],
  imports: [
    CommonModule,
    PayoutsRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PayoutsModule {}
