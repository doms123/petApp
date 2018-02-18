import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AdminProvider } from '../../providers/admin/admin';
import { AdminViewUserRegisteredPetsPage } from '../admin-view-user-registered-pets/admin-view-user-registered-pets';

@IonicPage()
@Component({
  selector: 'page-admin-view-profile',
  templateUrl: 'admin-view-profile.html',
})
export class AdminViewProfilePage {
  userId: any;
  user: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public adminProvider: AdminProvider,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');
    this.loadProfile();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  loadProfile() {
    this.adminProvider.loadProfile(this.userId).then(user => {
      this.user = user;
    });
  }

  registeredPetsClick() {
    let user: object = {
      userId: this.userId
    };
    let modal = this.modalCtrl.create(AdminViewUserRegisteredPetsPage, user);

    modal.onDidDismiss(data => {
      if (data) {
        // this.loadProfile();
      }
    });

    modal.present();
  }
}
