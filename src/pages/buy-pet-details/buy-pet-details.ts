import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BuypetProvider } from '../../providers/buypet/buypet';

@IonicPage()
@Component({
  selector: 'page-buy-pet-details',
  templateUrl: 'buy-pet-details.html',
})
export class BuyPetDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public buypetProvider: BuypetProvider) {
  }

  name: string;
  breed: string;
  type: string;
  color: string;
  gender: string;
  vaccineDate: string;
  remarks: string;
  ownerUid: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;


  ionViewDidLoad() {
    console.log('navParams', this.navParams);
    this.name = this.navParams.get('name');
    this.breed = this.navParams.get('breed');
    this.color = this.navParams.get('color');
    this.gender = this.navParams.get('gender');
    this.vaccineDate = this.navParams.get('vaccineDate');
    this.remarks = this.navParams.get('remarks');
    this.ownerUid = this.navParams.get('uid');
    this.type = this.navParams.get('petType');
    this.getOwnerInfo();
  }

  getOwnerInfo() {
    this.buypetProvider.ownerInfo(this.ownerUid).then(owner => {
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
