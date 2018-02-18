import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { AddLostPetFormPage } from '../add-lost-pet-form/add-lost-pet-form';
import { LostpetProvider } from '../../providers/lostpet/lostpet';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { LostPetDetailsPage } from '../lost-pet-details/lost-pet-details';
import { EditLostPetPage } from '../edit-lost-pet/edit-lost-pet';
import { ChatNotifFabPage } from '../chat-notif-fab/chat-notif-fab';

@IonicPage()
@Component({
  selector: 'page-admin-lost-pets',
  templateUrl: 'admin-lost-pets.html',
})
export class AdminLostPetsPage {

  pets: any;
  petsCount: number = 0;
  db: any = firebase.firestore();
  pageLoaded: boolean = false;
  userId: string = localStorage.getItem('userId');
  searchFocus: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController,
    public lostpetProvider: LostpetProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.getItems();
  }

  action(petId, status) {
    let text = '';
    if(status == 0) {
      text = 'Mark as found';
    }else {
      text = 'Mark as lost';
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your post',
      buttons: [
        {
          text: text,
          icon: 'checkbox-outline',
          handler: () => {
            this.removeLostPet(petId, status);
          }
        },{
          text: 'Edit',
          icon: 'create',
          handler: () => {
            let data: object = {
              petId: petId
            };
            let modal = this.modalCtrl.create(EditLostPetPage, data);
          
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

  onSearch(ev: any) {
    this.pageLoaded = false;
    let val = ev.target.value;

    this.db.collection('lostpets').orderBy("datePosted", "desc").limit(1000).onSnapshot(snapshots => {
      let pets = [];
      snapshots.forEach(doc => {
        let docData = doc.data();
        docData['lostPetId'] = doc.id
        pets.push(docData);
      });

      this.pets = pets;
      this.petsCount = Object.keys(pets).length;

      if (val && val.trim() != '') {
        this.pets =  this.pets.filter((el) => {
          return  (el.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                  (el.placeLost.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                  (el.petType.toLowerCase().indexOf(val.toLowerCase()) > -1)
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
    this.getItems();
  }

  addLostPet() {
    let modal = this.modalCtrl.create(AddLostPetFormPage);

    modal.onDidDismiss(data => {
      
    });

    modal.present();
  }

  getItems() {
    this.db.collection('lostpets').orderBy("datePosted", "desc").limit(1000).onSnapshot(snapshots => {
      console.log('snapshots', snapshots);
      let pets = [];
      snapshots.forEach(doc => {
        let docData = doc.data();
        docData['lostPetId'] = doc.id
        pets.push(docData);
      });
      this.pets = pets;
      console.log('this.pets', this.pets);
      this.petsCount = Object.keys(pets).length;
      this.pageLoaded = true;
    }),(err => {
      console.log('err', err);
    });
  }
  
  lostPetDetails(pet) {
    console.log('pet', pet);
    let modal = this.modalCtrl.create(LostPetDetailsPage, pet);

    modal.onDidDismiss(data => {
      if (data) {
        // this.loadProfile();
      }
    });

    modal.present();
  }

  removeLostPet(lostPetId, status) {
    let title = '';
    let message = '';
    
    if(status == 1) {
      title = 'Pet was lost?';
      message = 'Are you sure do you want to mark this pet as lost?';
    }else {
      title = 'Pet was found?';
      message = 'Are you sure do you want to mark this pet as found?';
    }

    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.db.collection('lostpets').doc(lostPetId).update({
              status: !status
            });

            let toast = this.toastCtrl.create({
              message: 'Post was updated',
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
}
