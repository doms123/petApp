import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyPetDetailsPage } from './buy-pet-details';

@NgModule({
  declarations: [
    BuyPetDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuyPetDetailsPage),
  ],
})
export class BuyPetDetailsPageModule {}
