import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import { NotifierService } from 'angular-notifier';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  obsTimer: Observable<number> = timer(1, 1);
  currTime: number;
  constructor(private notifierService: NotifierService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
      // console.log(response);
      // let resp: any = response;
      // if (resp.error.error) {
      //   this.obsTimer.subscribe((currTime) => (this.currTime = currTime));
      //   if (this.currTime == 1) {
      //     this.notifierService.notify('error', resp.error.message);
      //   }
      // }
    }
    throw response;
  }
}
