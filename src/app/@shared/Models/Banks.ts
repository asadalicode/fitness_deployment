import { Injectable } from '@angular/core';

export class Banks {
  constructor(public id: number, public title: string, public bank_swift_code: string) {}
  static adapt(item: any): Banks {
    return item.rows.map((item: any) => {
      return new Banks(item?.id, item?.name, item?.bank_swift_code);
    });
  }
}
