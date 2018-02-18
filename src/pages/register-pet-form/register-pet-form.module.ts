import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPetFormPage } from './register-pet-form';

@NgModule({
  declarations: [
    RegisterPetFormPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPetFormPage),
  ],
})
export class RegisterPetFormPageModule {}
