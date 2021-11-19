import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatHelperService {
  constructor() {}

  tryParseDate(args: number): Date {
    if (args != undefined) return new Date(args);
    else return new Date();
  }

  ArraySortByKey(inputArr: Object[], key: string, type = 1): Object[] {
    return type === 1
      ? inputArr.sort((a: Object, b: Object) => {
          if (a[key] > b[key]) return 1;
          else return -1;
        })
      : inputArr.sort((a: Object, b: Object) => {
          if (a[key] < b[key]) return 1;
          else return -1;
        });
  }
}
