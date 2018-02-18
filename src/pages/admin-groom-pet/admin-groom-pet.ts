import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminAddGroomPetPage } from '../admin-add-groom-pet/admin-add-groom-pet';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { EditGroomPetPage } from '../edit-groom-pet/edit-groom-pet';

@IonicPage()
@Component({
  selector: 'page-admin-groom-pet',
  templateUrl: 'admin-groom-pet.html',
})

export class AdminGroomPetPage {
  videos: any;
  videosCount: number = 0;
  db: any = firebase.firestore();
  pageLoaded: boolean = false;
  userId: string = localStorage.getItem('userId');
  isAdmin: any = parseInt(localStorage.getItem('isAdmin'));

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.getGroomPetVideos();
  }

  ionViewDidEnter() {
    this.markAsRead();
  }

  markAsRead() {
    let userName = localStorage.getItem('email').split('@')[0].replace('.','');
    firebase.database().ref(`notif/groompet/${userName}`).set({
      unread: 0
    });
  }
  
  getGroomPetVideos() {
    this.db.collection('groompetsvideos').where("isactive", "==", true).orderBy("datePosted", "desc").limit(1000).onSnapshot(snapshots => {
      let videos = [];
      snapshots.forEach(doc => {
        let docData = doc.data();
       
        docData['videoId'] = doc.id
        videos.push(docData);
      });

      this.videos = videos;
      this.videosCount = Object.keys(videos).length;
      this.pageLoaded = true;
      console.log('this.videos', this.videos);
    }),(err => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    });
  }

  addGroomPetVideos() {
    let modal = this.modalCtrl.create(AdminAddGroomPetPage);

    modal.onDidDismiss(data => {
      
    });

    modal.present();
  }

  removePost(videoId) {
    let confirm = this.alertCtrl.create({
      title: 'Remove this post?',
      message: 'Are you sure do you want to remove your post?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.db.collection('groompetsvideos').doc(videoId).update({
              isactive: false
            }).then(res => {
              let toast = this.toastCtrl.create({
                message: 'Video was deleted',
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

  action(videoId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your post',
      buttons: [
        {
          text: 'Remove',
          icon: 'trash',
          handler: () => {
            this.removePost(videoId);
          }
        }, {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            let data: object = {
              videoId: videoId
            };
            let modal = this.modalCtrl.create(EditGroomPetPage, data);

            modal.onDidDismiss(data => {

            });

            modal.present();
          }
        }, {
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
}
