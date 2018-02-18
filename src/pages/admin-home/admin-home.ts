import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AdminProvider } from '../../providers/admin/admin';
import { ChatNotifFabPage } from '../chat-notif-fab/chat-notif-fab';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  userCount: any = 0;
  buySellPetCount: any = 0;
  lostPetsCount: any = 0;
  vaccineSchedCount: any = 0;
  groomPetCount: any = 0;
  trainPetCount: any = 0;
  pageLoaded: boolean = false;
  userId: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public adminProvider: AdminProvider,
    public app: App,
    public badge: Badge
  ) {
    this.registeredUserCount();
    this.userId = localStorage.getItem('userId');
  }

  registeredUserCount() {
    this.adminProvider.registeredUserCount().then(count01 => {
      this.userCount = count01;
      this.adminProvider.buySellPetCount().then(count02 => {
        this.buySellPetCount = count02;
        this.adminProvider.lostPetCount().then(count03 => {
          this.lostPetsCount = count03;
          this.adminProvider.vaccineSchedCount().then(count4 => {
            this.vaccineSchedCount = count4;
            this.adminProvider.groomPetCount().then(count5 => {
              this.groomPetCount = count5;
              this.adminProvider.trainPetCount().then(count6 => {
                this.pageLoaded = true;
                this.trainPetCount = count6;
              }).catch(err => { 
                console.log('err', err);
              });
            }).catch(err => {
              console.log('err', err);
            }); 
          }).catch(err => {
            console.log('err', err);
          })
        }).catch(err => {
          console.log('err', err);
        });
      }).catch(err => {
        console.log('err', err);
      });
    }).catch(err => {
      console.log('err', err);
    });
  }

  pushPage(page) {
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
            this.authProvider.switchRole(this.userId, 0).then(() => {
              this.navCtrl.push('TabsPage');
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
}
