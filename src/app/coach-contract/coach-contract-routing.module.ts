import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddContractComponent } from './components/add-contract/add-contract.component';

const routes: Routes = [{ path: 'add-new-contract', component: AddContractComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachContractRoutingModule {}
