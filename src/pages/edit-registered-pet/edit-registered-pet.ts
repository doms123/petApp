import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterPetProvider } from '../../providers/register-pet/register-pet';

@IonicPage()
@Component({
  selector: 'page-edit-registered-pet',
  templateUrl: 'edit-registered-pet.html',
})
export class EditRegisteredPetPage {
  petId: string;
  image: any = '';
  name: string = '';
  petType: string = '';
  breed: string = '';
  color: string = '';
  age: string = '';
  gender: string = '';
  vaccineDate: string = '';
  remarks: string = '';

  imageCtrl: FormControl;
  nameCtrl: FormControl;
  petTypeCtrl: FormControl;
  breedCtrl: FormControl;
  colorCtrl: FormControl;
  ageCtrl: FormControl;
  genderCtrl: FormControl;
  vaccineDateCtrl: FormControl;
  remarksCtrl: FormControl;
  registerPetForm: FormGroup;

  isSubmitting: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public registerPetProvider: RegisterPetProvider,
    public toastCtrl: ToastController
  ) {
    this.imageCtrl = new FormControl('');
    this.nameCtrl = new FormControl('', Validators.required);
    this.petTypeCtrl = new FormControl('', Validators.required);
    this.breedCtrl = new FormControl('', Validators.required);
    this.colorCtrl = new FormControl('', Validators.required);
    this.ageCtrl = new FormControl('', Validators.required);
    this.genderCtrl = new FormControl('', Validators.required);
    this.vaccineDateCtrl = new FormControl('');
    this.remarksCtrl = new FormControl('');

    this.registerPetForm = new FormGroup({
      image: this.imageCtrl,
      name: this.nameCtrl,
      petType: this.petTypeCtrl,
      breed: this.breedCtrl,
      color: this.colorCtrl,
      age: this.ageCtrl,
      gender: this.genderCtrl,
      vaccineDate: this.vaccineDateCtrl,
      remarks: this.remarksCtrl
    });

    this.petId = this.navParams.get('petId');
    console.log('this.petId', this.petId);
    this.getRegisterPetInfo();
  }

  getRegisterPetInfo() {
    this.registerPetProvider.getRegisterPetInfo(this.petId).then(pet => {
      this.image = pet['image'];
      this.name = pet['name'];
      this.petType = pet['petType'];
      this.breed = pet['breed'];
      this.color = pet['color'];
      this.age = pet['age'];
      this.gender = pet['gender'];
      this.vaccineDate = pet['vaccineDate'];
      this.remarks = pet['remarks'];
    }).catch(err => {
      console.log('err', err);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  petPicUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your pet photo...'
    });

    loading.present();
    this.registerPetProvider.uploadPhoto(event.target.files.item(0)).then(photo => {
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

  registerPetFormSubmit() {
    this.isSubmitting = true;
    if (this.registerPetForm.valid) {
      console.log('valid');
      let petInfo: object = {
        name: this.name,
        petType: this.petType,
        image: this.image,
        breed: this.breed,
        color: this.color,
        age: this.age,
        gender: this.gender,
        remarks: this.remarks,
        vaccineDate: this.vaccineDate
      };

      this.registerPetProvider.saveUpdates(petInfo, this.petId).then(res => {
        this.isSubmitting = false;
        this.viewCtrl.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Updates was saved',
          duration: 4000,
          position: 'bottom'
        });

        toast.present();
      }).catch(err => {
        console.log('err', err);
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 4000,
          position: 'bottom'
        });

        toast.present();
      });
    }else {
      this.isSubmitting = false;
      let toast = this.toastCtrl.create({
        message: 'Post failed, please fill up all required fields',
        duration: 4000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
