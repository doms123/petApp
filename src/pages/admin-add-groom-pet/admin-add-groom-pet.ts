import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminProvider } from '../../providers/admin/admin';

@IonicPage()
@Component({
  selector: 'page-admin-add-groom-pet',
  templateUrl: 'admin-add-groom-pet.html',
})
export class AdminAddGroomPetPage {
  videoTitle: any;
  video: any;
  title: any;
  videoCtrl: FormControl;
  titleCtrl: FormControl;
  addGroomPetVideo: FormGroup;
  isSubmitting: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public adminProvider: AdminProvider,
    public toastCtrl: ToastController
  ) {
    this.videoCtrl = new FormControl('', Validators.required);
    this.titleCtrl = new FormControl('', Validators.required);
    this.isSubmitting = false;

    this.addGroomPetVideo = new FormGroup({
      video: this.videoCtrl,
      title: this.titleCtrl
    });
  }

  addGroomPetVideoSubmit() {
    this.isSubmitting = true;
    if (this.addGroomPetVideo.valid) {
      let data = {
        video: this.video,
        title: this.title,
        videoTitle: this.videoTitle,
        isactive: true
      };
      
      this.adminProvider.saveGroomPetVideo(data).then(res => {
        this.isSubmitting = false;
        this.navCtrl.push('AdminGroomPetPage');
        let toast = this.toastCtrl.create({
          message: 'Groom pet video was posted',
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      }).catch(err => {
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      });
    }else {
      this.isSubmitting = false;

      let toast = this.toastCtrl.create({
        message: 'Title and Video is required',
        duration: 4000,
        position: 'bottom'
      });

      toast.present();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  photoUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your video...'
    });

    loading.present();
    // let videoType = ['video/avi', 'video/mp4', 'video/quicktime', 'video/mp4', 'video/mpeg', 'video/x-ms-wmv']; 
    let videoType = ['video/mp4'];

    if (videoType.indexOf(event.target.files.item(0)['type']) != -1) {
      this.videoTitle = event.target.files.item(0)['name'];
      this.adminProvider.uploadPhoto(event.target.files.item(0)).then(photo => {
        this.video = photo;
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Video was uploaded',
          duration: 5000,
          position: 'bottom'
        });
      }).catch(err => {
        loading.dismiss();
        this.navCtrl.push('AdminGroomPetPage');
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
        message: 'Upload failed, file type must be mp4 format',
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
