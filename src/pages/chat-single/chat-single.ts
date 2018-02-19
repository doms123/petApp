import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, Content, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { ChatProvider } from '../../providers/chat/chat';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-chat-single',
  templateUrl: 'chat-single.html',
})
export class ChatSinglePage {
  db: any = firebase.firestore();
  receiverEmail: string;
  receiverName: string;
  receiverPhoto: string;
  userEmail: string;
  userId: string;
  userEmailName: string;
  userPhoto: string;
  chatTxt: string;
  chatTxtCtrl: FormControl;
  chatForm: FormGroup;
  chats: any;
  chatId: string;
  userName: string;
  pageLoaded: boolean = false;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public chatProvider: ChatProvider
  ) {
    this.chatTxtCtrl = new FormControl('', Validators.required);
    this.chatForm = new FormGroup({
      chatTxt: this.chatTxtCtrl
    });

    this.userEmail = localStorage.getItem('email');
    this.userId = localStorage.getItem('userId');
    this.userEmailName = localStorage.getItem('email').split('@')[0].replace('.','').toLowerCase();
    console.log('this.userEmailName', this.userEmailName);
    this.getChatReceiverInfo(this.navParams.data['uid']);
    this.scrollToBottom();
    
  }

  ionViewDidLoad() {
    this.getSenderPhoto();
  }

  markAsRead() {
    this.db.collection('chats').doc(this.chatId).collection('messages').get().then(res => {
      let unreadCount = 0;
      let data = res.docs.filter(messageData => {
        console.log('wwwwww', messageData.data().userEmailName);
        return messageData.data().userEmailName.toLowerCase() != this.userEmailName
      }).map(filterData => {
        unreadCount++;
        
        this.db.collection('chats').doc(this.chatId).collection('messages').doc(filterData.id).update({
          isRead: 1
        });
      });

      let notifRef = firebase.database().ref(`notif/chats/${this.userEmailName}`);
      notifRef.once('value', snapshot => {
        if(snapshot.hasChild('unread')) {
          let unread = snapshot.val().unread - unreadCount;
          if(unread < 0) {
            notifRef.set({
              unread: 0
            });
          }else {
            notifRef.set({
              unread: unread
            });
          }
        }else {
          notifRef.set({
            unread: 0
          });
        }
      });
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 300);

    setTimeout(() => {
      this.content.scrollToBottom();
    }, 2000);
  }

  getSenderPhoto() {
    this.db.collection('users').doc(this.userId).get().then(res => {
      let sender = res.data();
      this.userPhoto = sender.photo;
      this.userName = sender.name;
      if(this.userPhoto == null || this.userPhoto == '') {
        this.userPhoto = '';
      }
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });

      toast.present();
    });
  }

  getChatReceiverInfo(uid) {
    this.db.collection('users').doc(uid).get().then(res => {
      let receiver = res.data();
      this.receiverEmail = receiver.email.toLowerCase();
      this.receiverName = receiver.name;
      console.log('this.receiverName', this.receiverName);
      this.receiverPhoto = receiver.photo;
      let senderName = this.userEmail.split('@')[0].replace('.','');
      let recName = this.receiverEmail.split('@')[0].replace('.','');
      this.chatId = senderName < recName ? senderName+'-'+recName : recName+'-'+senderName;
      this.loadChatConversation();
      this.markAsRead();
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });

      toast.present();
    });
  }

  back() {
    this.navCtrl.pop();
  }

  loadChatConversation() {
    this.db.collection('chats').doc(this.chatId).collection('messages').orderBy("dateAdded", "asc").limit(1000).onSnapshot(res => {
      let data = res.docs.map(doc => doc.data());
      this.chats = data;
      this.pageLoaded = true;
    })
  }

  chatSubmit() {
    if(this.chatForm.valid) {
      let timeStampSec = new Date().getTime() / 1000;
      let payload = {
        message: this.chatTxt,
        isPhoto: false,
        name: this.userName,
        userEmailName: this.userEmailName,
        photo: this.userPhoto,
        isRead: 0,
        dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
        timestampInSecs: timeStampSec
      };
      this.chatTxt = '';

      this.db.collection('chats').doc(this.chatId).set({ // Add this to have doc field id
        docId: this.chatId
      });

      let receiverEmailName = this.receiverEmail.split('@')[0].replace('.','').toLowerCase();
      let notifRef = firebase.database().ref(`notif/chats/${receiverEmailName}`);
      notifRef.once('value', snapshot => {
        console.log('firing')
        if(snapshot.hasChild('unread')) {
        let unread = snapshot.val().unread + 1;
        notifRef.set({
          unread: unread
        });
        }else {
          notifRef.set({
            unread: 1
          });
        }
      });

      this.db.collection('chats').doc(this.chatId).collection('messages').add(payload).then(() => {
        this.scrollToBottom();
      }).catch(err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });
    
        toast.present();
      });

    }else {
      let toast = this.toastCtrl.create({
        message: 'Message is required in able to send!',
        duration: 3000,
        position: 'top'
      });

      toast.present();
    }
  }

  sendPhoto(event) {
    let loading = this.loadingCtrl.create({
      content: 'Sending photo, please wait...'
    });
  
    loading.present();

    let imageType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    if (imageType.indexOf(event.target.files.item(0)['type']) != -1) {
      this.chatProvider.uploadPhoto(event.target.files.item(0), this.chatId, this.userName, this.userEmailName,  this.userPhoto).then(photo => {
        loading.dismiss();
        this.scrollToBottom();
      }).catch(err => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });

        toast.present();
      });
    }else {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Invalid file type, only allowed file types are gif, png, jpeg, bmp, webp',
        duration: 3000,
        position: 'top'
      });

      toast.present();
    }
  }
}
