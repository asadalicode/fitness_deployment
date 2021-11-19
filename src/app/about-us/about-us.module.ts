import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditAboutUsComponent } from './components/edit-about-us/edit-about-us.component';

@NgModule({
  declarations: [AboutUsComponent, EditAboutUsComponent],
  imports: [CommonModule, AboutUsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, CKEditorModule],
})
export class AboutUsModule {}
