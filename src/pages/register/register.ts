import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  name: string;
  email: string;
  password: string;
  repassword: string;
  nameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  repasswordCtrl: FormControl;
  registerForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, private toastCtrl: ToastController) {
    this.nameCtrl = new FormControl('', Validators.required);
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.passwordCtrl = new FormControl('', Validators.required);
    this.repasswordCtrl = new FormControl('', Validators.required);

    this.registerForm = new FormGroup({
      name: this.nameCtrl,
      email: this.emailCtrl,
      password: this.passwordCtrl,
      repassword: this.repasswordCtrl
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  goToLoginPage() {
    this.navCtrl.push('LoginPage');
  }

  registerSubmit() {
    if(this.registerForm.valid) {
      this.isSubmitting = true;
      if(this.password == this.repassword) {
        let userData: object = {
          name: this.name,
          email: this.email,
          password: this.password
        };

        this.authProvider.register(userData).then(userId => {
          if(userId != '') {
            delete userData['password']; // delete password key in userData object
            this.authProvider.saveRegisteredUser(userId, userData).then(res => {
              this.authProvider.sendEmailVerification().then(emailRes => {
                this.isSubmitting = false;
                this.name = "";
                this.email = "";
                this.password = "";

                this.navCtrl.push('LoginPage');
                  let toast = this.toastCtrl.create({
                    message: 'Email verification was sent to your email, please verify your account to login',
                    duration: 7000,
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
            }).catch(err => {
              this.isSubmitting = false;
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 5000,
                position: 'bottom'
              });
        
              toast.present();
            });
          }
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
          message: `Re-enter password doesn't match`,
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
      }
    }else {
      this.isSubmitting = false;
      let toast = this.toastCtrl.create({
        message: 'Please fill out the fields properly',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
