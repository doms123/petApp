import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminGroomPetPage } from './admin-groom-pet';

@NgModule({
  declarations: [
    AdminGroomPetPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminGroomPetPage),
  ],
})
export class AdminGroomPetPageModule {}
