import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/material.module';
import { AuthModule } from '@app/auth';
import { ShellComponent } from './shell.component';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    NgMaterialMultilevelMenuModule,
    MaterialModule,
    AuthModule,
    I18nModule,
    RouterModule,
  ],
  declarations: [ShellComponent],
})
export class ShellModule {}
