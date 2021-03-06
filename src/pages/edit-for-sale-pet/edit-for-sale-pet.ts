import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BuypetProvider } from '../../providers/buypet/buypet';
import { endTimeRange } from '@angular/core/src/profile/wtf_impl';
import * as Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'b1c9abe51ae7422a8cf6f0977081d9aa'
});

@IonicPage()
@Component({
  selector: 'page-edit-for-sale-pet',
  templateUrl: 'edit-for-sale-pet.html',
})
export class EditForSalePetPage {
  petId: any;
  image: any = '';
  name: string = '';
  price: string = '';
  petType: string = '';
  breed: string = '';
  color: string = '';
  age: string = '';
  gender: string = '';
  vaccineDate: string = '';
  remarks: string = '';
  
  imageCtrl: FormControl;
  nameCtrl: FormControl;
  priceCtrl: FormControl;
  petTypeCtrl: FormControl;
  breedCtrl: FormControl;
  colorCtrl: FormControl;
  ageCtrl: FormControl;
  genderCtrl: FormControl;
  vaccineDateCtrl: FormControl;
  remarksCtrl: FormControl;
  addForSalePet: FormGroup;

  isSubmitting: boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public buypetProvider: BuypetProvider,
    public toastCtrl: ToastController
  ) {
    this.nameCtrl = new FormControl('', Validators.required);
    this.priceCtrl = new FormControl('', Validators.required);
    this.petTypeCtrl = new FormControl('', Validators.required);
    this.breedCtrl = new FormControl('', Validators.required);
    this.colorCtrl = new FormControl('', Validators.required);
    this.ageCtrl = new FormControl('', Validators.required);
    this.genderCtrl = new FormControl('', Validators.required);
    this.vaccineDateCtrl = new FormControl('');
    this.remarksCtrl = new FormControl('');
    this.imageCtrl = new FormControl('');

    this.addForSalePet = new FormGroup({
      image: this.imageCtrl,
      name: this.nameCtrl,
      price: this.priceCtrl,
      petType: this.petTypeCtrl,
      breed: this.breedCtrl,
      color: this.colorCtrl,
      age: this.ageCtrl,
      gender: this.genderCtrl,
      vaccineDate: this.vaccineDateCtrl,
      remarks: this.remarksCtrl
    });

    this.petId = this.navParams.get('petId');
    this.getPetInfo();
  }

  getPetInfo() {
    this.buypetProvider.getPetInfo(this.petId).then(pet => {
      this.image = pet['image'];
      this.name = pet['name'];
      this.price = pet['price'];
      this.petType = pet['petType'];
      this.breed = pet['breed'];
      this.color = pet['color'];
      this.age = pet['color'];
      this.gender = pet['gender'];
      this.vaccineDate = pet['vaccineDate'];
      this.remarks = pet['remarks'];
    }).catch(err => {
      console.log('err', err);
    });
  }

  addForSalePetSubmit() {
    this.isSubmitting = true;
    if(this.addForSalePet.valid) {
      let petInfo: object = {
        name: this.name,
        image: this.image,
        price: this.price,
        petType: this.petType,
        breed: this.breed,
        color: this.color,
        age: this.age,
        gender: this.gender,
        vaccineDate: this.vaccineDate,
        remarks: this.remarks,
        isactive: true,
      }

      this.buypetProvider.saveUpdatedPetInfo(petInfo, this.petId).then(res => {
        this.isSubmitting = false;
        this.viewCtrl.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Updates was posted',
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  } 

  petPicUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your pet photo...'
    });

    loading.present();
    this.buypetProvider.uploadPhoto(event.target.files.item(0)).then(photo => {
      
      app.models.predict(Clarifai.GENERAL_MODEL, photo).then(res => {
        let tagArray = res.rawData.outputs[0].data.concepts;
        let isValid = 0;

        for (var other = 0; other < tagArray.length; other++) {
          if (tagArray[other].name == 'dog' || tagArray[other].name == 'cat') {
            isValid = 1;
            let name = tagArray[other].name;

            this.petType = this.capitalizeFirstLetter(name);
          }
        }

        if (isValid) {
          app.models.predict(Clarifai.COLOR_MODEL, photo).then(res => {
            let tagArray = res.rawData.outputs[0].data.colors;
            this.color = tagArray[0].w3c.name;
            this.image = photo;
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Photo was uploaded',
              duration: 5000,
              position: 'bottom'
            });
          }, err => {
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: err.message,
              duration: 5000,
              position: 'bottom'
            });

            toast.present();
          });
        } else {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Upload failed, pet photo must be a cat or dog',
            duration: 5000,
            position: 'bottom'
          });

          toast.present();
        }
        
      }, err => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
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
