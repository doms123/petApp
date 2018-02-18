import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LostpetsPage } from './lostpets';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    LostpetsPage,
  ],
  imports: [
    IonicPageModule.forChild(LostpetsPage),
    ChatNotifFabPageModule
  ],
})
export class LostpetsPageModule {}
