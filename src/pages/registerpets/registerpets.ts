import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { RegisterPetFormPage } from '../register-pet-form/register-pet-form';
import { RegisteredPetDetailsPage } from '../registered-pet-details/registered-pet-details';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { EditRegisteredPetPage } from '../edit-registered-pet/edit-registered-pet';
import { Badge } from '@ionic-native/badge';
import { ChatNotifFabPage } from '../chat-notif-fab/chat-notif-fab';

@IonicPage()
@Component({
  selector: 'page-registerpets',
  templateUrl: 'registerpets.html',
})
export class RegisterpetsPage {
  pets: any;
  petsCount: number = 0;
  db: any = firebase.firestore();
  pageLoaded: boolean = false;
  userId: string = localStorage.getItem('userId');
  searchFocus: number = 0;
  userEmailName: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public badge: Badge
  ) {
    this.userEmailName = localStorage.getItem('email').split('@')[0].replace('.','');
    this.getRegisteredPets();
  }

  ionViewDidEnter() {
    this.searchFocus = 0;
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
                  (el.breed.toLowerCase().indexOf(val.toLowerCase()) > -1) || 
                  (el.petType.toLowerCase().indexOf(val.toLowerCase()) > - 1)
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
  
  addPet() {
    let modal = this.modalCtrl.create(RegisterPetFormPage);

    modal.onDidDismiss(data => {
      
    });

    modal.present();
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

  removeRegisteredPet(petId) {
    let confirm = this.alertCtrl.create({
      title: 'Remove Confirmation?',
      message: 'Are you sure do you want to remove your registered pet?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.db.collection('registerpets').doc(petId).update({
              isvisible: false
            });

            let toast = this.toastCtrl.create({
              message: 'Registered pet was removed',
              duration: 5000,
              position: 'bottom'
            });
      
            toast.present();
          }
        }
      ]
    });
    confirm.present();
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

  action(petId) {
    console.log('petId', petId);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your post',
      buttons: [
        {
          text: 'Remove',
          icon: 'trash',
          handler: () => {
            this.removeRegisteredPet(petId);
          }
        },{
          text: 'Edit',
          icon: 'create',
          handler: () => {
            let data: object = {
              petId: petId
            };
            let modal = this.modalCtrl.create(EditRegisteredPetPage, data);
          
            modal.onDidDismiss(data => {
              
            });
        
            modal.present();
          }
        },{
          text: 'Cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  checkFocus() {
    if(this.searchFocus == 0) {
      let toast = this.toastCtrl.create({
        message: 'You can search by pet name, type and breed',
        showCloseButton: true,
        duration: 5000,
        closeButtonText: 'Ok',
        dismissOnPageChange: true
      });
  
      toast.present();
    }

    this.searchFocus = 1;
  }

  goToChatList() {
    this.navCtrl.push('ChatListPage');
  }
}
