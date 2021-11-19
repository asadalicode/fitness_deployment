import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoachManagementRoutingModule } from './coach-management-routing.module';
import { CoachManagementComponent } from './components/coach-management/coach-management.component';

import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditCoachComponent } from './components/edit-coach/edit-coach.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CoachContractComponent } from './components/coach-contract/coach-contract.component';
import { CKEditorModule } from 'ckeditor4-angular';
@NgModule({
  declarations: [CoachManagementComponent, EditCoachComponent, CoachContractComponent],
  imports: [
    CommonModule,
    CoachManagementRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class CoachManagementModule {}
