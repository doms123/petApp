import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { AddVaccinationScheduleFormPage } from '../add-vaccination-schedule-form/add-vaccination-schedule-form';
import { EditVaccinationSchedPage } from '../edit-vaccination-sched/edit-vaccination-sched';
import * as firebase from 'firebase';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-vaccination-schedule',
  templateUrl: 'vaccination-schedule.html',
})
export class VaccinationSchedulePage {
  posts: any;
  postsCount: number = 0;
  db: any = firebase.firestore();
  pageLoaded: boolean = false;
  userId: string;
  isAdmin: number
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {
    this.userId = localStorage.getItem('userId');
    this.isAdmin = parseInt(localStorage.getItem('isAdmin'));
    this.getVaccinationSched();
  }

  ionViewDidEnter() {
    this.markAsRead();
  }

  markAsRead() {
    let userName = localStorage.getItem('email').split('@')[0].replace('.','');
    firebase.database().ref(`notif/vaccinesched/${userName}`).set({
      unread: 0
    });
  }

  addVaccinationSched() {
    let modal = this.modalCtrl.create(AddVaccinationScheduleFormPage);

    modal.onDidDismiss(data => {

    });

    modal.present();
  }

  getVaccinationSched() {
    this.pageLoaded = true;
    this.db.collection('vaccineschedules').where("isvisible", "==", true).onSnapshot(snapshots => {
      let pets = [];
      snapshots.forEach(doc => {
        let docData = doc.data();
        docData['postId'] = doc.id
        pets.push(docData);
      });
      this.posts = pets;
      this.postsCount = Object.keys(pets).length;
      this.pageLoaded = true;
    }), (err => {
      console.log('err', err);
    });
  }

  removePost(postId) {
    let confirm = this.alertCtrl.create({
      title: 'Remove your post?',
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
            this.db.collection('vaccineschedules').doc(postId).update({
              isvisible: false
            });

            let toast = this.toastCtrl.create({
              message: 'Post was removed',
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

  action(postId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your post',
      buttons: [
        {
          text: 'Remove',
          icon: 'trash',
          handler: () => {
            this.removePost(postId);
          }
        }, {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            let data: object = {
              postId: postId
            };
            let modal = this.modalCtrl.create(EditVaccinationSchedPage, data);

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
