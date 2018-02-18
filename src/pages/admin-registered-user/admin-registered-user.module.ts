import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminRegisteredUserPage } from './admin-registered-user';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    AdminRegisteredUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminRegisteredUserPage),
    ChatNotifFabPageModule
  ],
})
export class AdminRegisteredUserPageModule {}
