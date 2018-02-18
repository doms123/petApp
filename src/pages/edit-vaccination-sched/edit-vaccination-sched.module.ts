import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditVaccinationSchedPage } from './edit-vaccination-sched';

@NgModule({
  declarations: [
    EditVaccinationSchedPage,
  ],
  imports: [
    IonicPageModule.forChild(EditVaccinationSchedPage),
  ],
})
export class EditVaccinationSchedPageModule {}
