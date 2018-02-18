import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetPage } from './pet';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    PetPage,
  ],
  imports: [
    IonicPageModule.forChild(PetPage),
    ChatNotifFabPageModule
  ],
})
export class PetPageModule {}
