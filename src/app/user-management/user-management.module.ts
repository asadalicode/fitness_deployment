import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { ListComponent } from './components/list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditUserComponent } from './components/edit-user/edit-user.component';
@NgModule({
  declarations: [ListComponent, EditUserComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserManagementModule {}
