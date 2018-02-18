import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditGroomPetPage } from './edit-groom-pet';

@NgModule({
  declarations: [
    EditGroomPetPage,
  ],
  imports: [
    IonicPageModule.forChild(EditGroomPetPage),
  ],
})
export class EditGroomPetPageModule {}
