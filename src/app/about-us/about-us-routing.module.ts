import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { EditAboutUsComponent } from './components/edit-about-us/edit-about-us.component';

const routes: Routes = [
  { path: '', component: EditAboutUsComponent },
  { path: 'update', component: EditAboutUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutUsRoutingModule {}
