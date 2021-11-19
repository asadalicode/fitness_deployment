export class DashboardUsers {
  constructor(public coaches: [], public users: []) {}

  static adapt(item: any): DashboardUsers {
    return item.rows.map((item: any) => {
      return new DashboardUsers(item.Coaches, item.Users);
    });
  }
}
