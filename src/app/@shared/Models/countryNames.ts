import { Injectable } from '@angular/core';

export class CountryNames {
  constructor(public id: number, public title: string) {}
  static adapt(item: any): CountryNames {
    console.log(item);
    return item.rows.map((item: any) => {
      return new CountryNames(item.id, item.name);
    });
  }
}
