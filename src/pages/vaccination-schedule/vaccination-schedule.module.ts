import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaccinationSchedulePage } from './vaccination-schedule';

@NgModule({
  declarations: [
    VaccinationSchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(VaccinationSchedulePage),
  ],
})
export class VaccinationSchedulePageModule {}
