import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController } from 'ionic-angular';
import { EditprofilePage } from '../editprofile/editprofile';
import { ProfileProvider } from '../../providers/profile/profile';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: object;
  userId: string; 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authProvider: AuthProvider, 
    private toastCtrl: ToastController, 
    public modalCtrl: ModalController, 
    public profileProvider: ProfileProvider,
    public loadingCtrl: LoadingController ,
    public alertCtrl: AlertController,
    public app: App
  ) {
  }

  ionViewDidLoad() {
    this.userId = localStorage.getItem('userId');
    this.loadProfile(this.userId);
   
  }

  loadProfile(userId) {
    this.profileProvider.loadProfile(userId).then(userData => {
      console.log('userData', userData);
      this.user = userData;
    }).catch(err => {
      console.log(err);
    });
  }

  profileChange(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your profile picture, please wait...'
    });
  
    loading.present();

    let imageType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    if (imageType.indexOf(event.target.files.item(0)['type']) != -1) {
      this.profileProvider.uploadPhoto(event.target.files.item(0)).then(photo => {
        this.profileProvider.saveFileData(photo).then(res => {
          this.loadProfile(this.userId);
          loading.dismiss();
        });
      }).catch(err => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      });
    }else {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Invalid file type, only allowed file types are gif, png, jpeg, bmp, webp',
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    }
  }

  editProfile() {
    let modal = this.modalCtrl.create(EditprofilePage, this.user);

    modal.onDidDismiss(data => {
      if(data) {
        this.loadProfile(this.userId);
      }
    });

    modal.present();
  }

  registeredPetsClick() {
    this.navCtrl.push('RegisterpetSinglePage');
  }
}
