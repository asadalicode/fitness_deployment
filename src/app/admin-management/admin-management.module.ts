import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminManagementRoutingModule } from './admin-management-routing.module';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';

import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [AdminManagementComponent, AddAdminComponent, UserProfileComponent],
  imports: [
    CommonModule,
    AdminManagementRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminManagementModule {}
