import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminViewProfilePage } from './admin-view-profile';

@NgModule({
  declarations: [
    AdminViewProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminViewProfilePage),
  ],
})
export class AdminViewProfilePageModule {}
