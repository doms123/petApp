import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  name: string;
  email: string;
  phone: string;
  address: string;
  nameCtrl: FormControl;
  emailCtrl: FormControl;
  phoneCtrl: FormControl;
  addressCtrl: FormControl;
  editForm: FormGroup;
  isSubmitting: boolean = false;
  userId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private toastCtrl: ToastController, private profileProvider: ProfileProvider) {
    this.nameCtrl = new FormControl('');
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.phoneCtrl = new FormControl('');
    this.addressCtrl = new FormControl('');

    this.editForm = new FormGroup({
      name: this.nameCtrl,
      email: this.emailCtrl,
      phone: this.phoneCtrl,
      address: this.addressCtrl
    });

    this.name = navParams.get('name');
    this.email = navParams.get('email');
    this.phone = navParams.get('phone');
    this.address = navParams.get('address');
    this.userId = navParams.get('uid');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editProfileSubmit() {
    this.isSubmitting = true;

    if(this.editForm.valid) {
      let userData: object = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        address: this.address,
        uid: this.userId
      };

      this.profileProvider.editProfile(userData).then(res => {
        this.viewCtrl.dismiss(1);
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: 'Profile information was updated',
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
      let toast = this.toastCtrl.create({
        message: 'Invalid email address',
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
