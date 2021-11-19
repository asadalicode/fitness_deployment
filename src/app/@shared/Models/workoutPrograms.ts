export class WorkoutPrograms {
  constructor(public id: number, public name: string, public name_arabic: string) {}

  static adapt(item: any): WorkoutPrograms {
    return item.rows.map((item: any) => {
      return new WorkoutPrograms(item.id, item.name, item.name_arabic);
    });
  }
}
