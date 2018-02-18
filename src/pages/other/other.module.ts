import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherPage } from './other';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    OtherPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherPage),
    ChatNotifFabPageModule
  ],
})
export class OtherPageModule {}
