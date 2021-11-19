import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { MaterialModule } from '@app/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NewlineDirective } from './directives/newline.directive';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [ChatComponent, NewlineDirective],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
})
export class ChatModule {}
