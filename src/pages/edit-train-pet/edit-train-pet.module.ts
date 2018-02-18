import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTrainPetPage } from './edit-train-pet';

@NgModule({
  declarations: [
    EditTrainPetPage,
  ],
  imports: [
    IonicPageModule.forChild(EditTrainPetPage),
  ],
})
export class EditTrainPetPageModule {}
