import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    if (!value) return items;
    return items.filter((str) => {
      return str[field].toLowerCase().includes(value.toLowerCase());
    });
  }
}

@Pipe({
  name: 'truncateString',
})
// export class TruncateStringPipe implements PipeTransform {
export class TruncateStringPipe implements PipeTransform {
  transform(fullStr: string, strLen: number, separator?: string): any {
    if (fullStr) {
      if (fullStr.length < strLen) {
        return fullStr;
      }
    }
    separator = separator || '... ';
    return fullStr.substr(0, strLen) + separator;
  }
}
