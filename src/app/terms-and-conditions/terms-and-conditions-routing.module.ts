import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewComponent } from './components/add-new/add-new.component';
import { EditTermsAndConditionsComponent } from './components/edit-terms-and-conditions/edit-terms-and-conditions.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: '', component: AddNewComponent },
  // { path: 'edit-terms-and-conditions', component: EditTermsAndConditionsComponent },
  { path: 'add-new', component: AddNewComponent },
  { path: 'update', component: AddNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsAndConditionsRoutingModule {}
