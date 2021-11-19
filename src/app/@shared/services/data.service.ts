import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Users } from '../Models/users';
import { MediaObserver } from '@angular/flex-layout';
import { Rows } from '../Models/genericRows';
import { Coaches } from '../Models/coaches';
import { adminUsers } from '../Models/admins';
import { Reports } from '../Models/query';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  filters = {
    limit: 5,
    offset: 0,
    isToday: false,
    status: '',
    search: '',
    sortParams: {
      key: '',
      order: 'DESC',
    },
  };
  public searchSub$ = new Subject<any>();
  public profileUpdate$ = new Subject<boolean>();
  private selectedData$ = new BehaviorSubject<any>('');

  constructor(private http: HttpClient, private media: MediaObserver) {}

  setSelectedData(action: any) {
    this.selectedData$.next(action);
    this.setSelectedInStorage(action);
  }
  getSelectedData(): Observable<any> {
    if (!this.selectedData$.getValue()) {
      this.setSelectedData(this.getSelectedFromStorage());
    }
    return this.selectedData$.asObservable();
  }

  setSelectedInStorage(data: any) {
    return localStorage.setItem('selectedData', JSON.stringify(data));
  }

  getSelectedFromStorage() {
    return JSON.parse(localStorage.getItem('selectedData') || null);
  }

  //get array of objects e.g lists
  get(url: string, model: any): Observable<any> {
    return this.http
      .get(
        `${url}?limit=${this.filters.limit}&text=${this.filters.search}&offset=${this.filters.offset}&sortkey=${this.filters.sortParams.key}&order=${this.filters.sortParams.order}`
      )
      .pipe(
        // Adapt each item in the raw data array
        map((data: any) => {
          return Rows.adapt(data.data, model.adapt(data.data));
        })
      );
  }

  //getForTesting

  getForTesting(url: any) {
    return this.http.get(
      `${url}?today=${this.filters.isToday}&limit=${this.filters.limit}&offset=${this.filters.offset}`
    );
  }

  getForTestingMatrix(url: any) {
    return this.http.get(`${url}`);
  }
  getHeaderCards(url: any) {
    return this.http.get(`${url}`);
  }

  //get array of objects e.g lists (when no count is present in the API from server side)
  get_WithStaticCount(url: string, model: any): Observable<any> {
    return this.http
      .get(
        `${url}?limit=${this.filters.limit}&text=${this.filters.search}&offset=${this.filters.offset}&sortkey=${this.filters.sortParams.key}&order=${this.filters.sortParams.order}`
      )
      .pipe(
        // Adapt each item in the raw data array
        map((data: any) => {
          let rowsData = model.adapt({
            rows: data?.data,
          });
          rowsData = {
            count: data?.data?.length,
            data: rowsData,
          };
          return rowsData;
        })
      );
  }

  //get array of objects e.g lists (when no count is present in the API from server side)
  get_WithoutCount(url: string, model: any): Observable<any> {
    return this.http
      .get(
        `${url}?limit=${this.filters.limit}&text=${this.filters.search}&offset=${this.filters.offset}&sortkey=${this.filters.sortParams.key}&order=${this.filters.sortParams.order}`
      )
      .pipe(
        // Adapt each item in the raw data array
        map((data: any) =>
          model.adapt({
            rows: data?.data,
          })
        )
      );
  }

  post(url: string, model: any): Observable<any> {
    return this.http.post(`${url}`, model);
  }

  postFormData(url: string, model: any): Observable<any> {
    let fd: FormData = new FormData();
    for (var i in model) {
      fd.append(i, model[i]);
    }

    return this.http.post(`${url}`, fd);
  }

  putFormData(url: string, model: any): Observable<any> {
    let fd: FormData = new FormData();
    for (var i in model) {
      if (i != 'document_image') {
        fd.append(i, model[i]);
      }
    }
    if (model.document_image) {
      model.document_image.forEach((v: any, i: any) => {
        fd.append('document_image', v, i + 'document_image.png');
      });
    }
    return this.http.put(`${url}`, fd);
  }

  putGroupImagesData(url: string, model: any): Observable<any> {
    let fd: FormData = new FormData();

    console.log(model[i]);
    for (var i in model) {
      if (model[i]) {
        fd.append(i, model[i]);
      }

      // if (i != 'free_container_image') {
      //   fd.append(i, model[i]);
      // }
    }
    // if (model.image) {
    //   console.log('fff')
    //   fd.append('image', model[i], 'image.png');
    // }
    return this.http.put(`${url}`, fd);
  }

  putFormDataProfile(url: string, model: any): Observable<any> {
    let fd: FormData = new FormData();
    for (var i in model) {
      fd.append(i, model[i]);
    }

    return this.http.put(`${url}`, fd);
  }

  patch(url: string, model: any): Observable<any> {
    return this.http.patch(`${url}`, model);
  }

  put(url: string, model: any): Observable<any> {
    return this.http.put(`${url}`, model);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(`${url}`);
  }

  //get single object e.g details
  getSingle(url: string, model: any): Observable<any> {
    return this.http.get(`${url}?order=${this.filters.sortParams.order}`).pipe(
      // Adapt each item in the raw data array
      map((data: any) =>
        model.adapt({
          rows: [data?.data],
        })
      )
    );
  }

  getCountries(url: string, model: any): Observable<any> {
    return this.http.get(`${url}?order=${this.filters.sortParams.order}`).pipe(
      // Adapt each item in the raw data array
      map((data: any) => model.adapt(data))
    );
  }

  userData(): Observable<Rows> {
    const url = `/assets/data_files/user_data.json`;
    return this.http.get(environment.backendUrl + url).pipe(
      // Adapt each item in the raw data array
      map((data: any) => Rows.adapt(data, Users.adapt(data)))
    );
  }

  get isMobile(): boolean {
    return this.media.isActive('sm');
  }
  get smallDevice(): boolean {
    return this.media.isActive('xs');
  }
}
