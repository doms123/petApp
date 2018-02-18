import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:string = "TabsPage";
  rootPage: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // if(localStorage.getItem('uid') != '') {
    //   if (localStorage.getItem('adminSwitchUser') == '1') {
    //     this.rootPage = "AdminHomePage";
    //   }else {
    //     this.rootPage = "TabsPage";
    //   }
    // }else {
    //   this.rootPage = "HomePage";
    // }
    this.rootPage = "HomePage";
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

