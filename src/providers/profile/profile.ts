import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class ProfileProvider {
  db:any = firebase.firestore();
  basePath: string = '/uploads';
  userId: string = localStorage.getItem('userId');

  constructor(public http: HttpClient) {
    console.log('Hello ProfileProvider Provider', this.userId);
  }

  loadProfile(userId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(userId).get().then(doc => {
        resolve(doc.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  editProfile(userData: object) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(userData['uid']).update(userData).then(() => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  randomCharacters() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  uploadPhoto(upload) {
    let uploadName = upload['name'] + '-' + this.randomCharacters(); // create a random name for the upload name

    Object.defineProperty(upload, 'name', { // key is not rewritable so i need to define it again
      writable: true,
      value: uploadName
    });

    const promise = new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).put(upload);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve(uploadTask.snapshot.downloadURL);
        }
      );
    });

    return promise;
  }

  saveFileData(uploadedFilePath) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(this.userId).update({
        photo: uploadedFilePath
      }).then(() => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }
}
