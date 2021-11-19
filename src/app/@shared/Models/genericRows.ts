export class Rows {
  constructor(public data: [], public count: any) {}
  static adapt(totalRecords: any, item: any): Rows {
    let count = totalRecords?.count ? totalRecords.count : 0;
    return new Rows(item, count);
  }
}
