import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminLostPetsPage } from './admin-lost-pets';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    AdminLostPetsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminLostPetsPage),
    ChatNotifFabPageModule
  ],
})
export class AdminLostPetsPageModule {}
