import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Coaches {
  constructor(public id: string, public full_name: string) {}
}

export class Users {
  constructor(public id: string, public full_name: string) {}
}
export class NotificationDetail {
  constructor(
    public id: string,
    public title_english: string,
    public title_arabic: string,
    public body_english: string,
    public body_arabic: string,
    public users_ids: [],
    // public coach_ids: [],
    public action: boolean
  ) {}

  static adapt(item: any): NotificationDetail {
    return item.rows.map((item: any) => {
      //   if (item.Notification_users.length) {
      //     var user_ids = item.Notification_users.map((elem: any) => {
      //       return new Users(elem.id, elem.first_name + ' ' + elem.last_name);
      //     });
      //   }
      console.log(item);
      return new NotificationDetail(
        item?.id,
        item?.title_english,
        item?.title_arabic,
        item?.body_english,
        item?.body_arabic,
        item?.Notification_users,
        item?.from_admin
      );
    });
  }
}
