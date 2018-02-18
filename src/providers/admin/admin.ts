import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class AdminProvider {
  db: any = firebase.firestore();
  basePath: string = '/uploads';
  userId: string = localStorage.getItem('userId');

  constructor(public http: HttpClient) {
    console.log('Hello AdminProvider Provider');
  }

  saveGroomPetVideo(data) {
    const promise = new Promise((resolve, reject) => {
      data['uid'] = this.userId;
      data['datePosted'] = firebase.firestore.FieldValue.serverTimestamp();

      this.db.collection('groompetsvideos').doc().set(data).then(res => {
        this.db.collection('users').get().then(user => {
          user.docs.map(user => {
            if(user.data().email != localStorage.getItem('email')) {
              let userName = user.data().email.split('@')[0].replace('.','');
  
              firebase.database().ref(`notif/groompet/${userName}/`).once('value', snapshot => {
                console.log('firing')
                if(snapshot.hasChild('unread')) {
                let unread = snapshot.val().unread + 1;
                firebase.database().ref(`notif/groompet/${userName}/`).set({
                  unread: unread
                });
                }else {
                  firebase.database().ref(`notif/groompet/${userName}/`).set({
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

  loadProfile(userId) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(userId).get().then(doc => {
        resolve(doc.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  registeredUserCount() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').get().then(user => {
        resolve(user.docs.length);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  buySellPetCount() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('buypets').where("isactive", "==", true).get().then(user => {
        resolve(user.docs.length);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  lostPetCount() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('lostpets').where("status", "==", false).get().then(user => {
        resolve(user.docs.length);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  groomPetCount() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('groompetsvideos').where("isactive", "==", true).get().then(user => {
        resolve(user.docs.length);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  vaccineSchedCount() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('vaccineschedules').where("isvisible", "==", true).get().then(res => {
        resolve(res.docs.length);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  trainPetCount() {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('trainpetsvideos').where("isactive", "==", true).get().then(res => {
        resolve(res.docs.length);
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

  groomPetInfo(videoId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('groompetsvideos').doc(videoId).get().then(res => {
        resolve(res.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  trainPetInfo(videoId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('trainpetsvideos').doc(videoId).get().then(res => {
        resolve(res.data());
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  
  saveUpdatesTrainPet(data: object, videoId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('trainpetsvideos').doc(videoId).update(data).then(res => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  saveUpdatesGroomPet(data: object, videoId: string) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('groompetsvideos').doc(videoId).update(data).then(res => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  saveTrainPetVideo(data) {
    const promise = new Promise((resolve, reject) => {
      data['uid'] = this.userId;
      data['datePosted'] = firebase.firestore.FieldValue.serverTimestamp();

      this.db.collection('trainpetsvideos').doc().set(data).then(res => {
        this.db.collection('users').get().then(user => {
          user.docs.map(user => {
            if(user.data().email != localStorage.getItem('email')) {
              let userName = user.data().email.split('@')[0].replace('.','');
  
              firebase.database().ref(`notif/trainpet/${userName}/`).once('value', snapshot => {
                console.log('firing')
                if(snapshot.hasChild('unread')) {
                let unread = snapshot.val().unread + 1;
                firebase.database().ref(`notif/trainpet/${userName}/`).set({
                  unread: unread
                });
                }else {
                  firebase.database().ref(`notif/trainpet/${userName}/`).set({
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
}
