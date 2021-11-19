import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './components/faqs/faqs.component';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddNewComponent } from './components/add-new/add-new.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [FaqsComponent, AddNewComponent],
  imports: [
    CommonModule,
    FaqsRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
})
export class FaqsModule {}
