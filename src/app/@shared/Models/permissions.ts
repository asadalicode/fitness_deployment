import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Permissions {
  constructor(public id: number, public name: string, public url_prefix: string) {}

  static adapt(item: any): Permissions {
    console.log(item);
    return item.rows.map((item: any) => {
      return new Permissions(item.id, item.name, item.url_prefix);
    });
  }
}
