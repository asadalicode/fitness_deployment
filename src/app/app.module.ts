import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { CKEditorModule } from 'ckeditor4-angular';
import { SharedModule } from '@shared';
import { ChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BlockUIModule } from 'ng-block-ui';

import { NotifierModule } from 'angular-notifier';

import { notifierDefaultOptions } from './@shared/notification.service';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ChartsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    CKEditorModule,
    NgMaterialMultilevelMenuModule,
    SharedModule,
    ShellModule,
    HomeModule,
    NgbModule,
    AuthModule,
    Angulartics2Module.forRoot(),
    BlockUIModule.forRoot(),
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
    NgxDropzoneModule,
    NotifierModule.withConfig(notifierDefaultOptions),
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
