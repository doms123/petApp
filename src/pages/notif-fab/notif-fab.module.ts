import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifFabPage } from './notif-fab';

@NgModule({
  declarations: [
    NotifFabPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifFabPage),
  ],
  exports: [
    NotifFabPage
  ]
})
export class NotifFabPageModule {}
