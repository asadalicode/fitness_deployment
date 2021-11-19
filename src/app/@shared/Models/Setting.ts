import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { AppConstants } from '../constants/app-constants';

export class Setting {
  constructor(
    public id: string,
    public coach_contract_terms_and_conditions: string,
    public free_video_limit: number,
    public minimum_subscription_amount: number,

    // public free_sub_group_limit: number,

    public free_main_group_limit: number,
    public app_intro_video: string,
    public app_intro_video_arabic: string,
    public free_container_image: string,
    public paid_container_image: string, // public app_intro_video_arabic: string,
    public free_container_image_name: string,
    public paid_container_image_name: string,
    public app_intro_video_name: string,
    public app_intro_video_arabic_name: string
  ) {}

  static adapt(item: any): Setting {
    return item.rows.map(async (item: any) => {
      let free_container_image = await AppConstants.Instance.readUrlAsFile(
        environment.sasContainerUrl +
          '/' +
          item[4].value +
          environment.sasTokenUrl
      );
      let paid_container_image = await AppConstants.Instance.readUrlAsFile(
        environment.sasContainerUrl +
          '/' +
          item[5].value +
          environment.sasTokenUrl
      );

      let app_intro_video = await AppConstants.Instance.readUrlAsFile(
        environment.sasContainerUrl +
          '/' +
          item[3].value +
          environment.sasTokenUrl
      );
      let app_intro_video_arabic = await AppConstants.Instance.readUrlAsFile(
        environment.sasContainerUrl +
          '/' +
          item[3].value_arabic +
          environment.sasTokenUrl
      );

      // let free_container_image = await AppConstants.Instance.readUrlAsFile(environment.sasContainerUrl + '/' + item[4].value + environment.sasTokenUrl);
      // let paid_container_image = await AppConstants.Instance.readUrlAsFile(environment.image_url + '/' + item[5].value);

      // let app_intro_video = await AppConstants.Instance.readUrlAsFile(environment.image_url + '/' + item[3].value);
      // let app_intro_video_arabic = await AppConstants.Instance.readUrlAsFile(
      //   environment.image_url + '/' + item[3].value_arabic
      // );
      return new Setting(
        item[0].id,
        item[7].value,
        item[1].value,
        item[6].value,
        item[2].value,
        app_intro_video,
        app_intro_video_arabic,
        free_container_image,
        paid_container_image,
        item[4].value,
        item[5].value,
        item[3].value,
        item[3].value_arabic
      );
    });
  }
}
