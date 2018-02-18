import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisteredPetDetailsPage } from './registered-pet-details';

@NgModule({
  declarations: [
    RegisteredPetDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisteredPetDetailsPage),
  ],
})
export class RegisteredPetDetailsPageModule {}
