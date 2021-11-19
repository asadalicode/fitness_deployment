import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportManagementComponent } from './components/report-management/report-management.component';

const routes: Routes = [{ path: '', component: ReportManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportManagementRoutingModule {}
