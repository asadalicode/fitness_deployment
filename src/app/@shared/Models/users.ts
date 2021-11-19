import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Users {
  constructor(
    public id: number,
    public user_name: number,
    public first_name: number,
    public last_name: string,
    public full_name: string,
    public email: string,
    public gender: string,
    public country: string,
    public country_id: number,
    public phone_number: number,
    public action: boolean,
    public image_url: string
  ) {}

  static adapt(item: any): Users {
    return item.rows.map((item: any) => {
      return new Users(
        item.id,
        item.user_name,
        item.first_name,
        item.last_name,
        item.first_name + ' ' + item.last_name,
        item.email,
        item.gender,
        item?.Country?.name,
        item?.country_id,
        item.phone_number,
        item.is_verified,
        item?.image_url ? environment.image_url + '/' + item?.image_url : item?.image_url
      );
    });
  }
}
