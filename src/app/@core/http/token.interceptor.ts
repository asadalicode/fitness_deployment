import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
const credentialsKey = 'fitness_credentials';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  routeUrl: string = '';
  constructor(private router: Router) {
    router.events.subscribe((res: any) => {
      if (res.url) this.routeUrl = res.url;
    });
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    let token: string = null;
    if (savedCredentials) {
      // console.log(savedCredentials);
      const credentials = JSON.parse(savedCredentials);
      token = credentials['token'];
    }

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `bearer ${token}`,
          // 'access-page': `${this.routeUrl}`,
        },
      });
    }

    return next.handle(req);
  }
}
