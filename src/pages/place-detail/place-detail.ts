import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html',
})
export class PlaceDetailPage {
  name: any;
  address: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    
  }

  ionViewDidLoad() {
    console.log('navParams', this.navParams);
    this.name = this.navParams.get('name');
    this.address = this.navParams.get('vicinity');
    console.log('this.name', this.name);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
