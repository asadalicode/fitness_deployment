import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Pdf {
  constructor(public pdf: string) {}

  static adapt(item: any): Pdf {
    console.log('items', item);
    // return item.rows.map((item: any) => {
    return new Pdf(item?.statement_pdf);
    // });
  }
}
