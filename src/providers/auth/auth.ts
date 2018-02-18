import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class AuthProvider {
  db:any = firebase.firestore();
  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider', this.db);
  }

  login(email: string, password: string) {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  capitalize(str) {
    var wordCount = str.split(' ');
    var upperStr = '';
    for(let x = 0; x <= wordCount.length - 1; x++) {
      if (x > 0) {
        upperStr += ' ';
      }
      upperStr += wordCount[x].charAt(0).toUpperCase() + wordCount[x].slice(1).toLowerCase();
    }

    return upperStr;
  }

  register(userData: object) {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(userData['email'], userData['password']).then(user => {
        resolve(user['uid']);
      }).catch((err) => {
        reject(err);
      });
    });

    return promise;
  }

  saveRegisteredUser(userId, userData) {
    const promise = new Promise((resolve, reject) => {
      userData['phone'] = '';
      userData['address'] = '';
      userData['photo'] = '';
      userData['isAdmin'] = 0;
      userData['adminSwitchUser'] = 0;
      userData['uid'] = userId; 
      userData['dateAdded'] = firebase.firestore.FieldValue.serverTimestamp();
      this.db.collection('users').doc(userId).set(userData).then(() => {
        resolve(1);
      }).catch((err) => {
        reject(err);
      });
    });

    return promise;
  }

  sendEmailVerification() {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        user.sendEmailVerification().then(data => {
          resolve(data);
        }).catch(err => {
          resolve(err);
        });
      });
    });

    return promise;
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          if(user['emailVerified']) {
            resolve(1);
          }else {
            resolve(0);
          }
        }else {
          resolve(0);
        }
      });
    });

    return promise;
  }

  logout() {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().signOut().then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }

  switchRole(userId: string, role: number) {
    const promise = new Promise((resolve, reject) => {
      this.db.collection('users').doc(userId).update({
        adminSwitchUser: role
      }).then(res => {
        resolve(1);
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

  forgotPass(email: string) {
    const promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(res => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });

    return promise;
  }
}
