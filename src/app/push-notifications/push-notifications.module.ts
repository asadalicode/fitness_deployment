import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PushNotificationsRoutingModule } from './push-notifications-routing.module';
import { PushNotificationsComponent } from './components/push-notifications/push-notifications.component';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddNewNotificationComponent } from './components/add-new-notification/add-new-notification.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [PushNotificationsComponent, AddNewNotificationComponent],
  imports: [
    CommonModule,
    PushNotificationsRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class PushNotificationsModule {}
