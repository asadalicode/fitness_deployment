import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoachContractRoutingModule } from './coach-contract-routing.module';
import { AddContractComponent } from './components/add-contract/add-contract.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [AddContractComponent],
  imports: [
    CommonModule,
    CoachContractRoutingModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ],
})
export class CoachContractModule {}
