export class DashboardPayments {
  constructor(public gender: [], public status: []) {}

  static adapt(item: any): DashboardPayments {
    return item.rows.map((item: any) => {
      return new DashboardPayments(item.Gender, item.Status);
    });
  }
}
