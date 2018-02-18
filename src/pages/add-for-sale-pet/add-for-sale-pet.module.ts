import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddForSalePetPage } from './add-for-sale-pet';

@NgModule({
  declarations: [
    AddForSalePetPage,
  ],
  imports: [
    IonicPageModule.forChild(AddForSalePetPage),
  ],
})
export class AddForSalePetPageModule {}
