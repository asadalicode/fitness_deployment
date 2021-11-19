import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export class Faqs {
  constructor(
    public id: string,
    public question_en: string,
    public question_ar: string,
    public answer_en: string,
    public answer_ar: string,
    public action: boolean
  ) {}

  static adapt(item: any): Faqs {
    return item.rows.map((item: any) => {
      return new Faqs(item.id, item.question_en, item.question_ar, item.answer_en, item.answer_ar, item.is_active);
    });
  }
}
