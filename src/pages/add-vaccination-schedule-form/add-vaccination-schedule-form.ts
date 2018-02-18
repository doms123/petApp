import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VaccineProvider } from '../../providers/vaccine/vaccine';

@IonicPage()
@Component({
  selector: 'page-add-vaccination-schedule-form',
  templateUrl: 'add-vaccination-schedule-form.html',
})
export class AddVaccinationScheduleFormPage {
  image: any;
  title: any;
  notes: any;  
  vaccineDate: any;

  imageCtrl: FormControl;
  titleCtrl: FormControl;
  notesCtrl: FormControl;
  vaccineDateCtrl: FormControl;
  addVaccineForm: FormGroup;
  isSubmitting: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public vaccineProvider: VaccineProvider
  ) {
    this.isSubmitting = false;
    this.imageCtrl = new FormControl('');
    this.titleCtrl = new FormControl('', Validators.required);
    this.notesCtrl = new FormControl('');
    this.vaccineDateCtrl = new FormControl('');

    this.addVaccineForm = new FormGroup({
      image: this.imageCtrl,
      title: this.titleCtrl,
      notes : this.notesCtrl,
      vaccineDate: this.vaccineDateCtrl
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addVaccineFormSubmit() {
    this.isSubmitting = true;
    if (this.addVaccineForm.valid) {
      let vaccineData = {
        image: this.image,
        title: this.title,
        notes: this.notes,
        vaccineDate: this.vaccineDate
      };

      this.vaccineProvider.addVaccineSched(vaccineData).then(res => {
        this.isSubmitting = false;
        this.navCtrl.push('VaccinationSchedulePage');
        let toast = this.toastCtrl.create({
          message: 'Vaccine Schedule was posted',
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      }).catch(err => {
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      });
    }else {
      this.isSubmitting = false;
      console.log('invalid');
    }
  }

  petPicUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your banner'
    });

    loading.present();
    let imageType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp']; 
    if (imageType.indexOf(event.target.files.item(0)['type']) != -1) {
      this.vaccineProvider.uploadPhoto(event.target.files.item(0)).then(photo => {
        console.log('photo', photo);
        this.image = photo;
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Photo was uploaded',
          duration: 5000,
          position: 'bottom'
        });
      }).catch(err => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      });
    }else {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Invalid file type, only allowed file types are gif, png, jpeg, bmp, webp',
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
