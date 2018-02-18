import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatNotifFabPage } from './chat-notif-fab';

@NgModule({
  declarations: [
    ChatNotifFabPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatNotifFabPage),
  ],
  exports: [
    ChatNotifFabPage,
  ]
})
export class ChatNotifFabPageModule {}
