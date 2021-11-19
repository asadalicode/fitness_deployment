import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Coaches {
  constructor(
    public id: number,
    public full_name: string,
    public user_name: number,
    public first_name: number,
    public last_name: string,
    public email: string,
    public gender: string,
    public country: string,
    public phone_number: number,
    public program_type: string,
    public subscription_fee: string,
    public commission_percentage: string,
    public UserWorkoutProgramTypes: Object,
    public allow_private_chat: boolean,
    public comission_per: string,
    public image_url: string,
    public is_archived: boolean,
    public mounthly_subscription_price: number,
    public preffered_OTP_delivery: string,
    public selected_language: string,
    public subscribers_count: number,
    public user_type: string,
    public action: boolean
  ) {}

  static adapt(item: any): Coaches {
    return item.rows.map((item: any) => {
      return new Coaches(
        item?.id,
        item?.first_name + ' ' + item?.last_name,
        item?.user_name,
        item?.first_name,
        item?.last_name,
        item?.email,
        item?.gender,
        item?.Country?.name,
        item?.phone_number,
        item?.UserWorkoutProgramTypes[0]?.name,
        item?.mounthly_subscription_price,
        item?.comission_per,
        item?.UserWorkoutProgramTypes,
        item?.allow_private_chat,
        item?.comission_per,
        environment.sasContainerUrl +
          '/' +
          item?.image_url +
          environment.sasTokenUrl,
        item?.is_archived,
        item?.mounthly_subscription_price,
        item?.preffered_OTP_delivery,
        item?.selected_language,
        item?.subscribers_count,
        item?.user_type,
        item?.is_verified
      );
    });
  }
}
