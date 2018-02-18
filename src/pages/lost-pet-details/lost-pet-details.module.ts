import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LostPetDetailsPage } from './lost-pet-details';

@NgModule({
  declarations: [
    LostPetDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LostPetDetailsPage),
  ],
})
export class LostPetDetailsPageModule {}
