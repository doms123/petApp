import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminProvider } from '../../providers/admin/admin';

@IonicPage()
@Component({
  selector: 'page-edit-train-pet',
  templateUrl: 'edit-train-pet.html',
})
export class EditTrainPetPage {
  videoTitle: any;
  videoId: any;
  video: any;
  title: any;
  videoCtrl: FormControl;
  titleCtrl: FormControl;
  editTrainPetVideo: FormGroup;
  isSubmitting: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public adminProvider: AdminProvider
  ) {
    this.videoCtrl = new FormControl('', Validators.required);
    this.titleCtrl = new FormControl('', Validators.required);
    this.isSubmitting = false;

    this.editTrainPetVideo = new FormGroup({
      video: this.videoCtrl,
      title: this.titleCtrl
    });

    this.videoId = this.navParams.get('videoId');
    console.log('this.videoId', this.videoId);
    this.trainPetInfo();
  }

  trainPetInfo() {
    this.adminProvider.trainPetInfo(this.videoId).then(info => {
      console.log('info', info);
      this.videoTitle = info['videoTitle'];
      this.video = info['video'];
      this.title = info['title'];

    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 4000,
        position: 'bottom'
      });

      toast.present();
    });
  }

  editTrainPetVideoSubmit() {
    this.isSubmitting = true;

    if (this.editTrainPetVideo.valid) {
      let data: object = {
        video: this.video,
        videoTitle: this.videoTitle,
        title: this.title
      };

      this.adminProvider.saveUpdatesTrainPet(data, this.videoId).then(res => {
        this.isSubmitting = false;
        this.navCtrl.push('AdminTrainPetPage');
        let toast = this.toastCtrl.create({
          message: 'Updates was saved',
          duration: 4000,
          position: 'bottom'
        });

        toast.present();
      }).catch(err => {
        this.isSubmitting = false;
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 4000,
          position: 'bottom'
        });

        toast.present();
      });
    } else {
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

  petPicUploadEvent(event) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading your video...'
    });

    loading.present();
    let videoType = ['video/avi', 'video/mp4', 'video/quicktime', 'video/mp4', 'video/mpeg', 'video/x-ms-wmv'];

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
        this.navCtrl.push('AdminTrainPetPage');
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 5000,
          position: 'bottom'
        });

        toast.present();
      });
    } else {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Invalid file type, only allowed file types are mp4, m4v, mov, avi, flv, mpg and wmv',
        duration: 5000,
        position: 'bottom'
      });

      toast.present();
    }
  }
}
