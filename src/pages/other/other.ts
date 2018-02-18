import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ChatNotifFabPage } from '../chat-notif-fab/chat-notif-fab';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-other',
  templateUrl: 'other.html',
})
export class OtherPage {
  isAdmin: any;
  userId: any;
  gCount: number;
  tCount: number;
  vCount: number;
  userEmailName: string;
  db: any = firebase.firestore();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public app: App,
    public toastCtrl: ToastController,
    public badge: Badge
  ) {
    this.isAdmin = parseInt(localStorage.getItem('isAdmin'));
    this.userId = localStorage.getItem('userId');
    this.userEmailName = localStorage.getItem('email').split('@')[0].replace('.','');
    this.groompetNotif();
    this.vaccineSchedNotif();
    this.trainpetNotif();
  }

  groompetNotif() {
    firebase.database().ref(`notif/groompet/${this.userEmailName}`).on('value', snapshot => {
      if(snapshot.hasChild('unread')) {
        this.gCount = snapshot.val()['unread'];
      }else {
        this.gCount = 0;
      }
    });
  }

  trainpetNotif() {
    firebase.database().ref(`notif/trainpet/${this.userEmailName}`).on('value', snapshot => {
      if(snapshot.hasChild('unread')) {
        this.tCount = snapshot.val()['unread'];
      }else {
        this.tCount = 0;
      }
    });
  }

  vaccineSchedNotif() {
    firebase.database().ref(`notif/vaccinesched/${this.userEmailName}`).on('value', snapshot => {
      if(snapshot.hasChild('unread')) {
        this.vCount = snapshot.val()['unread'];
      }else {
        this.vCount = 0;
      }
    });
  }

  goToPage(page) {
    this.navCtrl.push(page);
  }

  logout() {
    let confirm = this.alertCtrl.create({
      title: 'Logout Confirmation?',
      message: 'Are you sure do you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.authProvider.logout().then(() => {
              localStorage.clear();
              this.badge.clear();
              this.app.getRootNav().setRoot('HomePage');
            }).catch(err => {
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 5000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    confirm.present();
  }

  switchRole() {
    let confirm = this.alertCtrl.create({
      title: 'Switch Role Confirmation?',
      message: 'Are you sure do you want to switch user role?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.authProvider.switchRole(this.userId, 1).then(() => {
              this.navCtrl.push('AdminHomePage');
              let toast = this.toastCtrl.create({
                message: 'Switching role completed',
                duration: 5000,
                position: 'bottom'
              });

              toast.present();
            }).catch(err => {
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 5000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    confirm.present();
  }

  goToChatList() {
    this.navCtrl.push('ChatListPage');
  }
}
