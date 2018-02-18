import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddVaccinationScheduleFormPage } from './add-vaccination-schedule-form';

@NgModule({
  declarations: [
    AddVaccinationScheduleFormPage,
  ],
  imports: [
    IonicPageModule.forChild(AddVaccinationScheduleFormPage),
  ],
})
export class AddVaccinationScheduleFormPageModule {}
