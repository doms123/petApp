import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class VaccineProvider {
  db: any = firebase.firestore();
  basePath: string = '/uploads';
  userId: string = localStorage.getItem('userId');

  constructor(public http: HttpClient) {
    console.log('Hello VaccineProvider Provider');
  }

  addVaccineSched(vaccineData) {
    const promise = new Promise((resolve, reject) => {
      vaccineData['uid'] = this.userId;
      vaccineData['datePosted'] = firebase.firestore.FieldValue.serverTimestamp();
      vaccineData['isvisible'] = true;
      this.db.collection('vaccineschedules').doc().set(vaccineData).then((res) => {

        this.db.collection('users').get().then(user => {
          user.docs.map(user => {
            if(user.data().email != localStorage.getItem('email')) {
              let userName = user.data().email.split('@')[0].replace('.','');
  
              firebase.database().ref(`notif/vaccinesched/${userName}/`).once('value', snapshot => {
                console.log('firing')
                if(snapshot.hasChild('unread')) {
                let unread = snapshot.val().unread + 1;
                firebase.database().ref(`notif/vaccinesched/${userName}/`).set({
                  unread: unread
                });
                }else {
                  firebase.database().ref(`notif/vaccinesched/${userName}/`).set({
                    unread: 1
                  });
                }
              });
            }
          });

          resolve(1);
        });
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

  getPostInfo(postId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('vaccineschedules').doc(postId).get().then(post => {
        resolve(post.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  editVaccineSched(vaccineData: object, postId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('vaccineschedules').doc(postId).update(vaccineData).then(res => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }
}
