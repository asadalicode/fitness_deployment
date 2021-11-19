import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Notifications {
  constructor(
    public id: string,
    public title: string,
    public title_arabic: string,
    public message: string,
    public message_arabic: string,
    public action: boolean
  ) {}

  static adapt(item: any): Notifications {
    return item.rows.map((item: any) => {
      return new Notifications(
        item?.id,
        item?.title_english,
        item?.title_arabic,
        item?.body_english,
        item?.body_arabic,
        item?.from_admin
      );
    });
  }
}
