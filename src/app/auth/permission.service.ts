import { Injectable } from '@angular/core';
import { CredentialsService } from './credentials.service';

@Injectable()
export class Permission {
  constructor(protected credentails: CredentialsService) {}
  can(permission: any) {
    let data: any = this.credentails;
    var p = data._credentials.AdminPermissions;
    return p.some((perm: any) => {
      return perm.url_prefix == permission;
    });
  }
}
