import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewNotificationComponent } from './components/add-new-notification/add-new-notification.component';
import { PushNotificationsComponent } from './components/push-notifications/push-notifications.component';

const routes: Routes = [
  { path: '', component: PushNotificationsComponent },
  { path: 'add-new-notification', component: AddNewNotificationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PushNotificationsRoutingModule {}
