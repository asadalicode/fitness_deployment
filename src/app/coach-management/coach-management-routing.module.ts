import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoachContractComponent } from './components/coach-contract/coach-contract.component';
import { CoachManagementComponent } from './components/coach-management/coach-management.component';
import { EditCoachComponent } from './components/edit-coach/edit-coach.component';

const routes: Routes = [
  { path: '', component: CoachManagementComponent },
  { path: 'edit-coach', component: EditCoachComponent },
  { path: 'coach-contract/:id', component: CoachContractComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachManagementRoutingModule {}
