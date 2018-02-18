import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLostPetFormPage } from './add-lost-pet-form';

@NgModule({
  declarations: [
    AddLostPetFormPage,
  ],
  imports: [
    IonicPageModule.forChild(AddLostPetFormPage),
  ],
})
export class AddLostPetFormPageModule {}
