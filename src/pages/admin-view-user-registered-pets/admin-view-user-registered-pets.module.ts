import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminViewUserRegisteredPetsPage } from './admin-view-user-registered-pets';

@NgModule({
  declarations: [
    AdminViewUserRegisteredPetsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminViewUserRegisteredPetsPage),
  ],
})
export class AdminViewUserRegisteredPetsPageModule {}
