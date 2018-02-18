import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminHomePage } from './admin-home';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    AdminHomePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminHomePage),
    ChatNotifFabPageModule
  ],
})
export class AdminHomePageModule {}
