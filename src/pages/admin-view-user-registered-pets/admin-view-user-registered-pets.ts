import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { RegisteredPetDetailsPage } from '../registered-pet-details/registered-pet-details';

@IonicPage()
@Component({
  selector: 'page-admin-view-user-registered-pets',
  templateUrl: 'admin-view-user-registered-pets.html',
})
export class AdminViewUserRegisteredPetsPage {
  userId: string;
  pets: any;
  petsCount: number = 0;
  db: any = firebase.firestore();
  pageLoaded: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');
    this.getRegisteredPets();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSearch(ev: any) {
    this.pageLoaded = false;
    let val = ev.target.value;

    this.db.collection('registerpets').where("isvisible", "==", true).onSnapshot(snapshots => {
      let pets = [];
      snapshots.forEach(doc => {
        let docData = doc.data();
        docData['regPetId'] = doc.id
        if(docData['uid'] == this.userId) {
          pets.push(docData);
        }
      });

      this.pets = pets;
      this.petsCount = Object.keys(pets).length;

      if (val && val.trim() != '') {
        this.pets =  this.pets.filter((el) => {
          return  (el.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                  (el.breed.toLowerCase().indexOf(val.toLowerCase()) > -1)
        });
      }

      setTimeout(() => {
        this.pageLoaded = true;
      }, 700);
    }),(err => {
      console.log('err', err);
    });
  }

  onCancel(ev: any) {
    this.getRegisteredPets();
  }

  getRegisteredPets() {
    this.db.collection('registerpets').where("isvisible", "==", true).onSnapshot(snapshots => {
      console.log('snapshots', snapshots);
      let pets = [];
      snapshots.forEach(doc => {
        let docData = doc.data();
        docData['regPetId'] = doc.id
        if(docData['uid'] == this.userId) {
          pets.push(docData);
        }
      });
      this.pets = pets;
      console.log('this.pets', this.pets);
      this.petsCount = Object.keys(pets).length;
      this.pageLoaded = true;
    }),(err => {
      console.log('err', err);
    });
  }

  registeredPetDetails(pet) {
    console.log('pet', pet);
    let modal = this.modalCtrl.create(RegisteredPetDetailsPage, pet);

    modal.onDidDismiss(data => {
      if (data) {
        // this.loadProfile();
      }
    });

    modal.present();
  }
}
