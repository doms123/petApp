import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditRegisteredPetPage } from './edit-registered-pet';

@NgModule({
  declarations: [
    EditRegisteredPetPage,
  ],
  imports: [
    IonicPageModule.forChild(EditRegisteredPetPage),
  ],
})
export class EditRegisteredPetPageModule {}
