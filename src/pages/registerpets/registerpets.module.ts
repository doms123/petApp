import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterpetsPage } from './registerpets';
import { ChatNotifFabPageModule } from '../chat-notif-fab/chat-notif-fab.module';

@NgModule({
  declarations: [
    RegisterpetsPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterpetsPage),
    ChatNotifFabPageModule,
  ],
})
export class RegisterpetsPageModule {}
