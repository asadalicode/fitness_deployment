import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'about',
      loadChildren: () => import('./about/about.module').then((m) => m.AboutModule),
    },
    {
      path: 'user-management',
      loadChildren: () => import('./user-management/user-management.module').then((m) => m.UserManagementModule),
    },
    {
      path: 'coach-management',
      loadChildren: () => import('./coach-management/coach-management.module').then((m) => m.CoachManagementModule),
    },
    {
      path: 'admin-management',
      loadChildren: () => import('./admin-management/admin-management.module').then((m) => m.AdminManagementModule),
    },
    {
      path: 'chat',
      loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
    },
    {
      path: 'report-management',
      loadChildren: () => import('./report-management/report-management.module').then((m) => m.ReportManagementModule),
    },
    {
      path: 'push-notifications',
      loadChildren: () =>
        import('./push-notifications/push-notifications.module').then((m) => m.PushNotificationsModule),
    },
    {
      path: 'terms-and-conditions',
      loadChildren: () =>
        import('./terms-and-conditions/terms-and-conditions.module').then((m) => m.TermsAndConditionsModule),
    },
    {
      path: 'about-us',
      loadChildren: () => import('./about-us/about-us.module').then((m) => m.AboutUsModule),
    },
    {
      path: 'faqs',
      loadChildren: () => import('./faqs/faqs.module').then((m) => m.FaqsModule),
    },
    {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
    },
    {
      path: 'payouts',
      loadChildren: () => import('./payouts/payouts.module').then((m) => m.PayoutsModule),
    },
    {
      path: 'contracts',
      loadChildren: () => import('./coach-contract/coach-contract.module').then((m) => m.CoachContractModule),
    },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
