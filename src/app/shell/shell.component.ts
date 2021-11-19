import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { ChatConstants } from '@app/@shared/constants/chat-constants';
import { UserServiceService } from '@app/chat/database/DbServices/user-service.service';
import { ThreadService } from '@app/chat/database/DbServices/thread.service';
import { ChatHelperService } from '@app/@shared/services/chat-helper-service.service';
import { MessagesMeta } from '@app/chat/models/threadmodel';
import { NotifierService } from 'angular-notifier';
import { DataService } from '@app/@shared/services/data.service';
import { environment } from '@env/environment';
import { Permission } from '@app/auth/permission.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  siderBarItems: any = [];
  currentUser: string;
  /* chat code  */
  helpMessagesArr = new Array<Object>();
  threadsArr = new Array();
  adminData: any;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver,
    /* char code */
    private _userDbService: UserServiceService,
    private _threadDbService: ThreadService,
    private _chatHelper: ChatHelperService,
    private notifyService: NotifierService,
    private dataService: DataService,
    public permission: Permission,
    private _userService: UserServiceService
  ) {}

  ngOnInit() {
    /*  these 2 lines is for chat */
    this.currentUser = localStorage.getItem(ChatConstants.firebase_key);
    // this.InitHelpCenter();
    this.getProfileUpdate();
    this.getAdminDetails();
    this.siderBarItems = [
      {
        name: 'Dashboard',
        link: '/home',
        icon_active: 'assets/fitness/icons/dashboard.png',
        icon_inactive: 'assets/fitness/icons/dashboard-b.png',
        url_prefix: 'dashboard',
      },
      {
        name: 'User Management',
        link: '/user-management',
        icon_active: 'assets/fitness/icons/user-management.png',
        icon_inactive: 'assets/fitness/icons/user-management-b.png',
        url_prefix: 'user',
      },
      {
        name: 'Coach Management',
        link: '/coach-management',
        icon_active: 'assets/fitness/icons/coach-management.png',
        icon_inactive: 'assets/fitness/icons/coach-management-b.png',
        url_prefix: 'coach',
      },
      {
        name: 'Admin Management',
        link: '/admin-management',
        icon_active: 'assets/fitness/icons/admin-management.png',
        icon_inactive: 'assets/fitness/icons/admin-management-b.png',
        url_prefix: 'admin',
      },
      {
        name: 'Chat',
        link: '/chat',
        icon_active: 'assets/fitness/icons/chat.png',
        icon_inactive: 'assets/fitness/icons/chat-b.png',
        url_prefix: 'chat',
      },
      {
        name: 'Query/Report Management',
        link: '/report-management',
        icon_active: 'assets/fitness/icons/query.png',
        icon_inactive: 'assets/fitness/icons/query-b.png',
        url_prefix: 'query_report',
      },
      {
        name: 'Push Notifications',
        link: '/push-notifications',
        icon_active: 'assets/fitness/icons/notifications.png',
        icon_inactive: 'assets/fitness/icons/notifications-black.png',
        url_prefix: 'notification',
      },
      {
        name: 'Terms & Conditions',
        link: '/terms-and-conditions',
        icon_active: 'assets/fitness/icons/tandc.png',
        icon_inactive: 'assets/fitness/icons/tandc-b.png',
        url_prefix: 'terms_and_conditions',
      },
      {
        name: 'About Us',
        link: '/about-us',
        icon_active: 'assets/fitness/icons/tandc.png',
        icon_inactive: 'assets/fitness/icons/tandc-b.png',
        url_prefix: 'about_us',
      },
      {
        name: 'FAQs',
        link: '/faqs',
        icon_active: 'assets/fitness/icons/faq.png',
        icon_inactive: 'assets/fitness/icons/faq-b.png',
        url_prefix: 'frequent_questions',
      },
      {
        name: 'Settings',
        link: '/settings',
        icon_active: 'assets/fitness/icons/setting.png',
        icon_inactive: 'assets/fitness/icons/setting-b.png',
        url_prefix: 'admin_setting',
      },
      {
        name: 'Payouts',
        link: '/payouts',
        icon_active: 'assets/fitness/icons/payout.png',
        icon_inactive: 'assets/fitness/icons/payout-b.png',
        url_prefix: 'payout',
      },

      {
        name: 'Partner Terms & Conditions',
        link: '/contracts/add-new-contract',
        icon_active: 'assets/fitness/icons/payout.png',
        icon_inactive: 'assets/fitness/icons/payout-b.png',
        url_prefix: 'coach_contract',
      },
    ];
  }

  getAdminData() {
    this.dataService
      .getForTesting('/admin/get_admin_details')
      .subscribe((res: any) => {
        let statusObj = {
          online: false,
        };
        if (res.data.firebase_key) {
          this._userService.updateAdminStatus(res.data.firebase_key, statusObj);
        }
      });
  }

  getProfileUpdate() {
    this.dataService.profileUpdate$.subscribe((res: boolean) => {
      this.getAdminDetails();
    });
  }

  getAdminDetails() {
    this.dataService
      .getForTesting('/admin/get_admin_details')
      .subscribe((res: any) => {
        res.data.image_url = res.data?.image_url
          ? environment.sasContainerUrl +
            '/' +
            res.data?.image_url +
            environment.sasTokenUrl
          : '';
        this.adminData = res.data;
      });
  }

  selectLink(val: any) {
    this.selectedItem = val;
  }

  logout() {
    this.getAdminData();
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.email : null;
  }

  get isMobile(): boolean {
    return (
      this.media.isActive('xs') ||
      this.media.isActive('sm') ||
      this.media.isActive('md')
    );
  }

  get title(): string {
    return this.titleService.getTitle();
  }
  selectedItem(e: any) {
    console.log(e);
  }
  isActive(url: any): boolean {
    return this.router.isActive(url, true);
  }
  get smallDevice(): boolean {
    return this.media.isActive('xs');
  }

  /*  Chat Code */
  async InitHelpCenter() {
    this._userDbService.getUserThreads(this.currentUser).then((resp) => {
      this.threadsArr = resp.exists() ? Object.keys(resp.val()) : new Array();
      this._userDbService.onNewThread(this.currentUser, async (resp) => {
        if (resp.exists()) {
          let thread = resp.val() as Object;
          let threadKey = resp.key;
          let senderKey = thread['invitedBy'];
          if (senderKey === this.currentUser) return;
          if (this.threadsArr.includes(threadKey)) return;
          let senderObj = (await (
            await this._userDbService.getSpecificUser(senderKey)
          ).val()) as Object;
          let senderMeta = senderObj.hasOwnProperty('meta')
            ? (senderObj['meta'] as Object)
            : new Object();
          let isMember = this.helpMessagesArr.find(
            (x) => x['id'] === threadKey
          );
          if ([null, undefined].includes(isMember)) {
            let intialMesssage = await this.WelcomeCustomer(
              threadKey,
              senderKey
            );
            this.helpMessagesArr.unshift({
              id: threadKey,
              name: senderMeta['name'],
              message: intialMesssage['meta'].text,
            });
          }
          this.notifyService.notify('success', 'Message Received');
        }
      });
    });
  }

  async WelcomeCustomer(
    ThreadID: string,
    receiverID: string
  ): Promise<MessagesMeta> {
    let Message = 'Welcome Customer if you have any query feel free to text';
    let _message_model = new MessagesMeta();
    _message_model.date = new Date().getTime();
    _message_model.from = localStorage.getItem(ChatConstants.firebase_key);
    _message_model.meta = { text: Message };
    _message_model.to.push(receiverID);
    _message_model.type = 0;
    _message_model.user_firebase_id = ThreadID;
    await await this._threadDbService.createMessageThread(
      _message_model,
      ThreadID
    );
    return _message_model;
  }
}
