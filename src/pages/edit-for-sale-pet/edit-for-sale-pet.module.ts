import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditForSalePetPage } from './edit-for-sale-pet';

@NgModule({
  declarations: [
    EditForSalePetPage,
  ],
  imports: [
    IonicPageModule.forChild(EditForSalePetPage),
  ],
})
export class EditForSalePetPageModule {}
