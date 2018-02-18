import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditLostPetPage } from './edit-lost-pet';

@NgModule({
  declarations: [
    EditLostPetPage,
  ],
  imports: [
    IonicPageModule.forChild(EditLostPetPage),
  ],
})
export class EditLostPetPageModule {}
