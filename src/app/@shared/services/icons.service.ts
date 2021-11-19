import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

interface ICON {
  name: String;
  path: String;
}

// TODO: add new icon in this list
const icons: ICON[] = [
  { name: 'dashboard', path: '/assets/fitness/icons/dashboard.svg' },
  { name: 'dashboard-b', path: '/assets/fitness/icons/dashboard-b.svg' },

  { name: 'user-management', path: '/assets/fitness/icons/user-management.svg' },
  { name: 'user-management-b', path: '/assets/fitness/icons/user-management-b.svg' },

  { name: 'coach_management', path: '/assets/fitness/icons/coach_management.svg' },
  { name: 'admin_management', path: '/assets/fitness/icons/admin_management.svg' },
  { name: 'chat', path: '/assets/fitness/icons/chat.svg' },
  { name: 'query', path: '/assets/fitness/icons/query.svg' },
  { name: 'push_notifications', path: '/assets/fitness/icons/push_notifications.svg' },
  { name: 'terms', path: '/assets/fitness/icons/terms.svg' },
  { name: 'settings', path: '/assets/fitness/icons/settings.svg' },

  { name: 'icon-left', path: '/assets/icon-left.svg' },
  { name: 'icon-right', path: '/assets/icon-right.svg' },
  { name: 'cancel', path: '/assets/cancel.svg' },
  { name: 'img-edit', path: '/assets/fitness/icons/img-edit.svg' },
  { name: 'sub-head', path: '/assets/Ellipse 570 (1).svg' },
  { name: 'custom_oval', path: '/assets/custom_circle.svg' },
  { name: 'gray-circle', path: '/assets/gray-circle.svg' },

  { name: 'content-management', path: '/assets/Group 9595.svg' },
  { name: 'send', path: '/assets/send.svg' },

  { name: 'calender', path: '/assets/fi-rr-calendar.svg' },

  { name: 'sub-menu', path: '/assets/sub-menu.svg' },
  { name: 'edit', path: '/assets/fitness/Edit.svg' },
  { name: 'delete', path: '/assets/fitness/Delete.svg' },
  { name: 'search', path: '/assets/fitness/search.svg' },
  { name: 'tick', path: '/assets/fitness/tick.svg' },
  { name: 'cross', path: '/assets/fitness/cross.svg' },

  { name: 'lock', path: '/assets/fitness/Lock.svg' },
  { name: 'view', path: '/assets/fitness/View.svg' },
  { name: 'edit_inline', path: '/assets/_icons/Edit.svg' },
  { name: 'arrow-icon', path: '/assets/arrow-icon.svg' },
];

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  baseURL = '';

  constructor(public iconRegistry: MatIconRegistry, public sanitizer: DomSanitizer) {
    // base url depends on the enviorment. it is your site domain
    // like http://localhost:4200 or http://example.com
    this.baseURL = window.location.origin;
  }

  registerIcons() {
    //registered your icons
    icons.forEach((e: any) => {
      this.iconRegistry.addSvgIcon(e.name, this.sanitizer.bypassSecurityTrustResourceUrl(this.baseURL + e.path));
    });
  }
}
