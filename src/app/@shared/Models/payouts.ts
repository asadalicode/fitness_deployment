import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Payouts {
  constructor(
    public id: number,

    public coach_user_name: string,
    public last_statement_date: Date,
    public total_subscribers: number,
    public total_coach_share: string,
    public coach_id: number,
    public amount: number,
    public action: boolean
  ) {}

  static adapt(item: any): Payouts {
    console.log(item);
    return item.rows.map((item: any) => {
      return new Payouts(
        item?.id,
        item?.User?.user_name,
        item?.last_statement_date,
        item?.total_subscribers,
        // '$' + item?.total_coach_share,
        item?.total_coach_share,
        item?.coach_id,
        item?.amount,
        item?.User?.is_verified || false
      );
    });
  }
}
