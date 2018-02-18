import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@IonicPage()
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html',
})
export class ForgotPassPage {
  email: string;
  emailCtrl: FormControl;
  forgotPassForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public authProvider: AuthProvider) {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);

    this.forgotPassForm = new FormGroup({
      email: this.emailCtrl,
    });
  }

  forgotPasswordSubmit() {
    this.isSubmitting = true;
    if (this.forgotPassForm.valid) {
      this.authProvider.forgotPass(this.email).then(res => {
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: 'Password reset email sent',
          duration: 5000,
          position: 'bottom'
        });

        this.email = '';
        this.navCtrl.push('LoginPage');

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
        duration: 4000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
