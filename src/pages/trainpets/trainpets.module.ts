import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainpetsPage } from './trainpets';

@NgModule({
  declarations: [
    TrainpetsPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainpetsPage),
  ],
})
export class TrainpetsPageModule {}
