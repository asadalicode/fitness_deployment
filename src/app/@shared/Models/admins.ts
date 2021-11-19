import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class adminUsers {
  constructor(
    public id: number,

    public user_name: number,
    public email: string,
    public role: string,
    public permission: [],
    public created_at: Date,
    public image_url: string,
    public firebase_key: string,
    public action: boolean
  ) {}

  static adapt(item: any): adminUsers {
    return item.rows.map((item: any) => {
      return new adminUsers(
        item?.id,
        item?.name,
        item?.email,
        item?.role,
        item?.AdminPermissions,
        item?.createdAt,
        item?.image_url ? environment.image_url + '/' + item?.image_url : item?.image_url,
        item?.firebase_key || null,
        item?.is_active
      );
    });
  }
}
