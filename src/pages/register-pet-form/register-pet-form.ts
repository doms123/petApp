import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterPetProvider } from '../../providers/register-pet/register-pet';
import * as Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'b1c9abe51ae7422a8cf6f0977081d9aa'
});

@IonicPage()
@Component({
  selector: 'page-register-pet-form',
  templateUrl: 'register-pet-form.html',
})
export class RegisterPetFormPage {
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
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
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
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  } 

  petPicUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your pet photo...'
    });

    loading.present();

    let imageType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    if (imageType.indexOf(event.target.files.item(0)['type']) != -1) {
      this.registerPetProvider.uploadPhoto(event.target.files.item(0)).then(photo => {
       
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
            console.log('tagArray', tagArray);
            let html = "We have analyzed your uploaded image, to help you describe the pet photo that you have uploaded, here’s our prediction.";
            html += '<ul class="predictUl">';
            html += '<li><span class="title01">PREDICTED CONCEPT</span><span class="title02">PROBABILITY</span></li>'

            for (var other = 0; other < tagArray.length; other++) {
              if(other < 10) {
                html += '<li><span class="name">'+tagArray[other].name+'</span> <span class="value">'+tagArray[other].value+'</span></li>';
              }
            }

            html += '</ul>';
            
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: html,
              buttons: ['OK']
            });
            alert.present();

            this.image = photo;
              loading.dismiss();
              let toast = this.toastCtrl.create({
                message: 'Photo was uploaded',
                duration: 5000,
                position: 'bottom'
              });
            // app.models.predict(Clarifai.COLOR_MODEL, photo).then(res => {
            //   let tagArray = res.rawData.outputs[0].data.colors;
            //   this.color = tagArray[0].w3c.name;
              
            // }, err => {
            //   loading.dismiss();
            //   let toast = this.toastCtrl.create({
            //     message: err.message,
            //     duration: 5000,
            //     position: 'bottom'
            //   });

            //   toast.present();
            // });
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

  dismiss() {
    this.viewCtrl.dismiss();
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

      this.registerPetProvider.saveLostPet(petInfo).then(res => {
        this.isSubmitting = false;
        this.viewCtrl.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Lost pet was posted',
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
