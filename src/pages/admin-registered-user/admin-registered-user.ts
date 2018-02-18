import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AdminViewProfilePage } from '../admin-view-profile/admin-view-profile';
import { ChatNotifFabPage } from '../chat-notif-fab/chat-notif-fab';

@IonicPage()
@Component({
  selector: 'page-admin-registered-user',
  templateUrl: 'admin-registered-user.html',
})
export class AdminRegisteredUserPage {
  users: any;
  usersCount: number = 0;
  db: any = firebase.firestore();
  pageLoaded: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.loadRegisteredUsers();
    let toast = this.toastCtrl.create({
      message: 'Slide the list to perform an action',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });

    toast.present();
  }

  viewProfile(userId) {
    let user: object = {
      userId: userId
    };
    let modal = this.modalCtrl.create(AdminViewProfilePage, user);

    modal.onDidDismiss(data => {
      if (data) {
        // this.loadProfile();
      }
    });

    modal.present();
  }

  loadRegisteredUsers() {
    this.db.collection('users').orderBy("dateAdded").limit(1000).onSnapshot(res => {
      let users = [];
      res.forEach((doc) => {
        users.push(doc.data());
      });

      this.pageLoaded = true;
      this.users = users;
    }), (err => {
      console.log('err', err);
    });
  }

  deleteUser(event, uid, name) {
    event.stopPropagation();
    console.log('uid', uid);

    let confirm = this.alertCtrl.create({
      title: 'Delete User?',
      message: `Are you sure do you want to delete <strong>${name}</strong> user account?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.db.collection('users').doc(uid).delete().then(() => {
              let toast = this.toastCtrl.create({
                message: 'User was deleted',
                duration: 4000,
                position: 'bottom'
              });
        
              toast.present();
            }).catch(err => {
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 4000,
                position: 'bottom'
              });
        
              toast.present();
            });
          }
        }
      ]
    });
    confirm.present();

    return false;
  }

  editRole(event, uid, name, isAdmin) {
    event.stopPropagation();
    

    let confirm = this.alertCtrl.create({
      title: 'Update user role?',
      message: `Are you sure do you want to update ${name}'s role in the app?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            if(isAdmin == 1) {
              isAdmin = 0;
            }else {
              isAdmin = 1;
            }
            this.db.collection('users').doc(uid).update({
              isAdmin: isAdmin,
              adminSwitchUser: isAdmin
            }).then(() => {
              let toast = this.toastCtrl.create({
                message: `${name}'s user role was updated`,
                duration: 4000,
                position: 'bottom'
              });

              toast.present();
            }).catch(err => {
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 4000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });
    confirm.present();
    
    return false;
  }
  
}
