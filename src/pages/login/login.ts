import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController } from 'ionic-angular';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  loginForm: FormGroup;
  isSubmitting: boolean = false;
  userId: string = '';
  isAdmin: number = 0;
  isadminSwitchUser: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authProvider: AuthProvider, 
    private toastCtrl: ToastController,
    public app: App  
  ) {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.passwordCtrl = new FormControl('', Validators.required);

    this.loginForm = new FormGroup({
      email: this.emailCtrl,
      password: this.passwordCtrl
    });
  }
  
  ionViewDidEnter() {
    if(this.userId != '') {
      if(this.isadminSwitchUser == 1) { // admin redirect
        this.app.getRootNav().setRoot('AdminHomePage');
      }else { // normal user redirect
        this.app.getRootNav().setRoot('TabsPage');
      }
    }else {
      return true;
    }
  }

  goToPage(page) {
    this.navCtrl.push(page);
    return false;
  }

  loginSubmit() {
    if(this.loginForm.valid) {
      this.isSubmitting = true;
      this.authProvider.login(this.email, this.password).then(user => {
        console.log('user', user)
          if (user['emailVerified']) {
            this.isSubmitting = false;
            this.userId = user['uid'];
            localStorage.setItem('userId', user['uid']);
            localStorage.setItem('email', user['email'].toLowerCase());
            this.authProvider.loadProfile(user['uid']).then(res => {
              localStorage.setItem('isAdmin', res['isAdmin']);
              localStorage.setItem('adminSwitchUser', res['adminSwitchUser']);
              if(res['adminSwitchUser'] == 1) { // admin redirect
                this.isadminSwitchUser = 1;
                this.navCtrl.push('AdminHomePage');
              }else { // normal user redirect
                this.isadminSwitchUser = 0;
                this.navCtrl.push('TabsPage');
              }
            }).catch(err => {
              this.isSubmitting = false;
              let toast = this.toastCtrl.create({
                message: 'Invalid email or password',
                duration: 5000,
                position: 'bottom'
              });
        
              toast.present();
            });
          }else {
            this.isSubmitting = false;
            let toast = this.toastCtrl.create({
              message: 'Login failed, your email address is not verified yet',
              duration: 5000,
              position: 'bottom'
            });
      
            toast.present();
          }
      }).catch(err => {
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: 'Invalid email or password',
          duration: 5000,
          position: 'bottom'
        });
  
        toast.present();
      });
    }else { 
      this.isSubmitting = false;
      let toast = this.toastCtrl.create({
        message: 'Login failed',
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
