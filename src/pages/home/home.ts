import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ViewChild } from '@angular/core';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  goToLoginPage() {
    this.navCtrl.push("LoginPage");
  }

  ionViewDidEnter() {
    this.authProvider.isAuthenticated().then(isAuth => {
      if(isAuth) {
        if (parseInt(localStorage.getItem('adminSwitchUser')) == 1) {
          this.navCtrl.push('AdminHomePage');
        }else {
          this.navCtrl.push('TabsPage');
        }
      }else {
        return true;
      }
    });
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 4) {
      this.navCtrl.push("LoginPage");
    }
  }
}
