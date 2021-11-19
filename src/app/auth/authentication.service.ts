import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '@app/@shared/services/data.service';
import { UserServiceService } from '@app/chat/database/DbServices/user-service.service';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Credentials, CredentialsService } from './credentials.service';

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private credentialsService: CredentialsService,
    private dataService: DataService,
    private http: HttpClient
  ) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    const url = `/admin/sign_in`;
    return this.http.post<any>(url, context).pipe(
      map((data) => {
        this.credentialsService.setCredentials(data.data, context.remember);
        return data;
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  async updateKey(key: string): Promise<boolean> {
    /* TODO: This is kuwait api need to create in fitness app */
    return this.http
      .patch(`/admin/firebase/${key}`, {})
      .pipe(
        map((data: any) => {
          return !data.error;
        })
      )
      .toPromise();
  }

  private _userData: any;
  set userData(value: any) {
    this._userData = value;
  }

  get userData(): any {
    return this._userData;
  }
}
