export class TermsConfitions {
  constructor(
    public matrix: string,
    public value: string,
    public value_arabic: string,
    public created_at: Date,
    public status: string
  ) {}

  static adapt(item: any): TermsConfitions {
    return item.rows.map((item: any) => {
      return new TermsConfitions(
        item?.matrix,
        item?.value,
        item?.value_arabic,
        item?.created_at,
        item?.status || false
      );
    });
  }
}
