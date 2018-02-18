import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-chat-notif-fab',
  templateUrl: 'chat-notif-fab.html',
})
export class ChatNotifFabPage {
  db: any = firebase.firestore();
  userEmailName: string;
  totalUnread: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public badge: Badge) {
    this.userEmailName = localStorage.getItem('email').split('@')[0].replace('.','');
    this.getPermission();
    this.getUnreadMessages();
  }

  async getPermission() {
    try {
      let permission = await this.badge.registerPermission();
    }catch(err) {
      console.log(err);
    }
  }

  getUnreadMessages() {
    let notifRef = firebase.database().ref(`notif/chats/${this.userEmailName}`);
    notifRef.on('value', snapshot => {
      console.log('firing')
      if(snapshot.hasChild('unread')) {
        this.totalUnread = snapshot.val()['unread'];
      }else {
        this.totalUnread = 0;
      }
      this.badge.set(this.totalUnread);
    });
  }

  goToChatList() {
    this.navCtrl.push('ChatListPage');
  }
}
