import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Reports {
  constructor(
    public id: number,
    public user_name: number,
    public email: string,
    public phone_number: number,
    public created_at: Date,
    public query: string,
    public action: boolean,
    public status: string
  ) {}

  static adapt(item: any): Reports {
    return item.rows.map((item: any) => {
      return new Reports(
        item?.id,
        item?.User?.user_name,
        item?.User?.email,
        item?.User?.phone_number,
        item.createdAt,
        item.query,
        item.is_resolved,
        item.is_resolved ? 'resolved' : 'unresolved'
      );
    });
  }
}
