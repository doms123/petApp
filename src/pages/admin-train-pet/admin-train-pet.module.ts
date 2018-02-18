import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminTrainPetPage } from './admin-train-pet';

@NgModule({
  declarations: [
    AdminTrainPetPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminTrainPetPage),
  ],
})
export class AdminTrainPetPageModule {}
