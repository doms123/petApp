import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminBuyAndSellPage } from './admin-buy-and-sell';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    AdminBuyAndSellPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminBuyAndSellPage),
    ChatNotifFabPageModule
  ],
})
export class AdminBuyAndSellPageModule {}
