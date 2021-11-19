import { DataRowOutlet } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getCategories(level: number, parentId: number, flag: number): Observable<any[]> {
    return this.http.get(`/api/admin/category/getCategories?level=${level}&parent_id=${parentId}&flag=${flag}`).pipe(
      map((data: any) => {
        let firstVal = {
          id: 0,
          name: 'All',
        };
        data.data.unshift(firstVal);
        data.data = data.data.sort((a: any, b: any) => {
          if (a.id > b.id) {
            return 1;
          } else {
            return -1;
          }
        });
        return data.data.map((val: any) => {
          return {
            id: val.id,
            name: val.name,
          };
        });
      })
    );
  }

  getCompaniesByCategory(categoryId: number) {
    return this.http.get(`/api/admin/user/getUserByCategory?category_id=${categoryId}`).pipe(
      map((data: any) => {
        if (!data.error) {
          return data.data.rows;
        }
      })
    );
  }
}
