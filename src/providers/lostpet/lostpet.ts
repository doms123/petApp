import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class LostpetProvider {
  db: any = firebase.firestore();
  basePath: string = '/uploads';
  userId: string = localStorage.getItem('userId');

  constructor(public http: HttpClient) {
    
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
      pet['status'] = false;
      this.db.collection('lostpets').doc().set(pet).then((res) => {
        this.db.collection('users').get().then(user => {
          user.docs.map(user => {
            if(user.data().email != localStorage.getItem('email')) {
              let userName = user.data().email.split('@')[0].replace('.','');
  
              firebase.database().ref(`notif/lostpets/${userName}/`).once('value', snapshot => {
                console.log('firing')
                if(snapshot.hasChild('unread')) {
                let unread = snapshot.val().unread + 1;
                firebase.database().ref(`notif/lostpets/${userName}/`).set({
                  unread: unread
                });
                }else {
                  firebase.database().ref(`notif/lostpets/${userName}/`).set({
                    unread: 1
                  });
                }
              });
            }
          });

          resolve(1);
        })
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  saveUpdates(pet: object, petId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('lostpets').doc(petId).update(pet).then((res) => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  ownerInfo(uid: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(uid).get().then(snapshots => {
        resolve(snapshots.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  getLostPetInfo(petId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('lostpets').doc(petId).get().then(pet => {
        resolve(pet.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }
}
