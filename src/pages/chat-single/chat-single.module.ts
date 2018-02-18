import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatSinglePage } from './chat-single';

@NgModule({
  declarations: [
    ChatSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatSinglePage),
  ],
})
export class ChatSinglePageModule {}
