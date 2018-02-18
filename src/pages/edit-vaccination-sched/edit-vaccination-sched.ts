import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VaccineProvider } from '../../providers/vaccine/vaccine';

@IonicPage()
@Component({
  selector: 'page-edit-vaccination-sched',
  templateUrl: 'edit-vaccination-sched.html',
})
export class EditVaccinationSchedPage {
  postId: any;
  image: any;
  title: any;
  notes: any;
  vaccineDate: any;

  imageCtrl: FormControl;
  titleCtrl: FormControl;
  notesCtrl: FormControl;
  vaccineDateCtrl: FormControl;
  editVaccineForm: FormGroup;
  isSubmitting: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public vaccineProvider: VaccineProvider
  ) {
    this.imageCtrl = new FormControl('');
    this.titleCtrl = new FormControl('');
    this.notesCtrl = new FormControl('');
    this.vaccineDateCtrl = new FormControl('');
    this.isSubmitting = false;

    this.editVaccineForm = new FormGroup({
      image: this.imageCtrl,
      title: this.titleCtrl,
      notes: this.notesCtrl,
      vaccineDate: this.vaccineDateCtrl
    });

    this.postId = this.navParams.get('postId');
    this.getPostInfo();
  }

  getPostInfo() {
    this.vaccineProvider.getPostInfo(this.postId).then(pet => {
      this.image = pet['image'];
      this.title = pet['title'];
      this.notes = pet['notes'];
      this.vaccineDate = pet['vaccineDate'];
    }).catch(err => {
      console.log('err', err);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editVaccineFormSubmit() {
    this.isSubmitting = true;
    if(this.editVaccineForm.valid) {
      let vaccineData = {
        image: this.image,
        title: this.title,
        notes: this.notes,
        vaccineDate: this.vaccineDate
      };

      this.vaccineProvider.editVaccineSched(vaccineData, this.postId).then(res => {
        this.isSubmitting = false;
        this.navCtrl.push('VaccinationSchedulePage');
        let toast = this.toastCtrl.create({
          message: 'Post updates was saved',
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
    }
  }

  petPicUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your banner'
    });

    loading.present();
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
  }
}
