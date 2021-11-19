import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Angulartics2Module } from 'angulartics2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    NgxMultipleDatesModule,
    SharedModule,
    FlexLayoutModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    Angulartics2Module,
    HomeRoutingModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
