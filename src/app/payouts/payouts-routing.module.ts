import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayoutsComponent } from './components/payouts/payouts.component';

const routes: Routes = [{ path: '', component: PayoutsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayoutsRoutingModule {}
