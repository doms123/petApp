import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1: string = "RegisterpetsPage";
  tab2: string = "PetPage";
  tab3: string = "LostpetsPage";
  tab4: string = "OtherPage";
  db: any = firebase.firestore();
  userEmailName: string;
  buyAndSellNotifCount: number;
  lostPetNotifCount: number;
  otherNotifCount: number;
  gCount: number;
  tCount: number;
  vCount: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private authProvider: AuthProvider, 
    public app: App,
    public badge: Badge) {
    this.userEmailName = localStorage.getItem('email').split('@')[0].replace('.','');
    this.getBuyAndSellNotif();
    this.getLostPetNotif();
    this.groompetNotif();
    this.trainpetNotif();
    this.vaccineSchedNotif();
    this.countAllNotif();
  }

  ionViewDidEnter() {
    this.authProvider.isAuthenticated().then(isAuth => {
      if(isAuth) {
        return true;
      }else {
        this.app.getRootNav().setRoot('HomePage');
      }
    });
  }

  countAllNotif() {
    firebase.database().ref('notif').on('value', snapshot => {
      let promises = [];
      let totalNotif = 0;

      const buyAndSell = new Promise((resolve, reject) => {
        firebase.database().ref(`notif/buyandsell/${this.userEmailName}`).once('value', snapshot => {
          if(snapshot.hasChild('unread')) {
            totalNotif += snapshot.val()['unread'];
          }
          resolve(1);
        });
      });

      const lostPet = new Promise((resolve, reject) => {
        firebase.database().ref(`notif/lostpets/${this.userEmailName}`).once('value', snapshot => {
          if(snapshot.hasChild('unread')) {
            totalNotif += snapshot.val()['unread'];
          }
          resolve(1);
        });
      });

      const chat = new Promise((resolve, reject) => {
        firebase.database().ref(`notif/chats/${this.userEmailName}`).once('value', snapshot => {
          if(snapshot.hasChild('unread')) {
            totalNotif += snapshot.val()['unread'];
          }
          resolve(1);
        });
      });

      const groompet = new Promise((resolve, reject) => {
        firebase.database().ref(`notif/groompet/${this.userEmailName}`).once('value', snapshot => {
          if(snapshot.hasChild('unread')) {
            totalNotif += snapshot.val()['unread'];
          }
          resolve(1);
        });
      });

      const trainpet = new Promise((resolve, reject) => {
        firebase.database().ref(`notif/trainpet/${this.userEmailName}`).once('value', snapshot => {
          if(snapshot.hasChild('unread')) {
            totalNotif += snapshot.val()['unread'];
          }
          resolve(1);
        });
      });

      const vaccinesched = new Promise((resolve, reject) => {
        firebase.database().ref(`notif/vaccinesched/${this.userEmailName}`).once('value', snapshot => {
          if(snapshot.hasChild('unread')) {
            totalNotif += snapshot.val()['unread'];
          }
          resolve(1);
        });
      });

      promises.push(buyAndSell, lostPet, chat, groompet, trainpet, vaccinesched);


      Promise.all(promises).then(() => {
        this.badge.set(totalNotif);
        console.log('totalNotif', totalNotif)
      });
    }); 
  }

  getBuyAndSellNotif() {
    firebase.database().ref(`notif/buyandsell/${this.userEmailName}`).on('value', snapshot => {
      if(snapshot.hasChild('unread')) {
        this.buyAndSellNotifCount = snapshot.val()['unread'];
      }else {
        this.buyAndSellNotifCount = 0;
      }
    });
  }

  getLostPetNotif() {
    firebase.database().ref(`notif/lostpets/${this.userEmailName}`).on('value', snapshot => {
      if(snapshot.hasChild('unread')) {
        this.lostPetNotifCount = snapshot.val()['unread'];
      }else {
        this.lostPetNotifCount = 0;
      }
    });
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
}
