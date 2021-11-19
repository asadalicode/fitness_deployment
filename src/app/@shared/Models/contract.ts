export class Contract {
  constructor(
    public id: number,

    public coach_contract_english: string,
    public coach_contract_arabic: string
  ) {}

  static adapt(item: any): Contract {
    return item.rows.map((item: any) => {
      return new Contract(item.id, item.value, item.value_arabic);
    });
  }
}
