import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroompetPage } from './groompet';

@NgModule({
  declarations: [
    GroompetPage,
  ],
  imports: [
    IonicPageModule.forChild(GroompetPage),
  ],
})
export class GroompetPageModule {}
