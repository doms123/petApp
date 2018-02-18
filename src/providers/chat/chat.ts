import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class ChatProvider {
  db:any = firebase.firestore();
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

  uploadPhoto(upload, chatId, name, userEmailName, userPhoto) {
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
          let timeStampSec = new Date().getTime() / 1000;
          let payload = {
            message: uploadTask.snapshot.downloadURL,
            isPhoto: true,
            name: name,
            userEmailName: userEmailName,
            photo: userPhoto,
            isRead: 0,
            dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
            timestampInSecs: timeStampSec
          };

          this.db.collection('chats').doc(chatId).collection('messages').add(payload).then(res => {
            resolve(1);
          }).catch(err => {
            console.log('err', err);
          });
        }
      );
    });

    return promise;
  }
}
