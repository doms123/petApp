import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LostpetProvider } from '../../providers/lostpet/lostpet';

@IonicPage()
@Component({
  selector: 'page-lost-pet-details',
  templateUrl: 'lost-pet-details.html',
})
export class LostPetDetailsPage {
  name: string;
  breed: string;
  type: string;
  color: string;
  gender: string;
  placeLost: string;
  lostDate: string;
  remarks: string;
  ownerUid: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public lostpetProvider: LostpetProvider) {
  }

  ionViewDidLoad() {
    console.log('navParams', this.navParams);
    this.name = this.navParams.get('name');
    this.breed = this.navParams.get('breed');
    this.color = this.navParams.get('color');
    this.gender = this.navParams.get('gender');
    this.placeLost = this.navParams.get('placeLost');
    this.lostDate = this.navParams.get('lostDate');
    this.remarks = this.navParams.get('remarks');
    this.ownerUid = this.navParams.get('uid');
    this.type = this.navParams.get('petType');
    this.getOwnerInfo();
  }

  getOwnerInfo() {
    this.lostpetProvider.ownerInfo(this.ownerUid).then(owner => {
      this.ownerName = owner['name'];
      this.ownerEmail = owner['email'];
      this.ownerPhone = owner['phone'];
      this.ownerAddress = owner['address'];
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
