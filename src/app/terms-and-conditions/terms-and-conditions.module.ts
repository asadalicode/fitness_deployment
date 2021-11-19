import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { MaterialModule } from '@app/material.module';
import { EditTermsAndConditionsComponent } from './components/edit-terms-and-conditions/edit-terms-and-conditions.component';
import { AddNewComponent } from './components/add-new/add-new.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [TermsAndConditionsComponent, EditTermsAndConditionsComponent, AddNewComponent],
  imports: [
    CommonModule,
    TermsAndConditionsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
})
export class TermsAndConditionsModule {}
