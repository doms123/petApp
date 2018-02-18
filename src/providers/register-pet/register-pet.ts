import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class RegisterPetProvider {
  db: any = firebase.firestore();
  basePath: string = '/uploads';
  userId: string = localStorage.getItem('userId');

  constructor(public http: HttpClient) {
    console.log('Hello RegisterPetProvider Provider');
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

  saveLostPet(pet: object) {
    const promise = new Promise((resolve, reject) => {
      pet['uid'] = this.userId;
      pet['datePosted'] = firebase.firestore.FieldValue.serverTimestamp();
      pet['isvisible'] = true;
      this.db.collection('registerpets').doc().set(pet).then((res) => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  saveUpdates(pet: object, petId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('registerpets').doc(petId).update(pet).then((res) => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  ownerInfo(uid) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(uid).get().then(snapshots => {
        resolve(snapshots.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  getRegisterPetInfo(petId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('registerpets').doc(petId).get().then(pet => {
        resolve(pet.data());
      }).catch(err => {
        reject(err);
      })
    });

    return promise;
  }
}
