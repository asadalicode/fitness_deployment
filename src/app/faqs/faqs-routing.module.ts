import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewComponent } from './components/add-new/add-new.component';
import { FaqsComponent } from './components/faqs/faqs.component';

const routes: Routes = [
  { path: '', component: FaqsComponent },
  { path: 'add-new', component: AddNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqsRoutingModule {}
