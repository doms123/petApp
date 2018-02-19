import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { ChatProvider } from '../../providers/chat/chat';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  db: any = firebase.firestore();
  userId: any;
  userEmailName: string;
  chatLists: any;
  pageLoaded: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public chatProvider: ChatProvider
  ) {
    this.userId = localStorage.getItem('userId');
    this.userEmailName = localStorage.getItem('email').split('@')[0].replace('.', '').toLowerCase();
  }

  ionViewDidLoad() {
    this.loadChatList();
  }

  openChatSingle(chatId) {
    let chatUserArr = chatId.split('-');
    let name = chatUserArr[0] == this.userEmailName ? chatUserArr[1] : chatUserArr[0];

    this.db.collection('users').get().then(res => {
      let data = res.docs.map(doc => doc.data());
      let user = data.filter(user => user.email.split('@')[0].replace('.', '').toLowerCase() == name.toLowerCase());
      let payload = {uid: user[0].uid};
      this.navCtrl.push('ChatSinglePage', payload);
    }).catch(err => {
      console.log(err);
    });
  }

  loadChatList() {
      this.db.collection("chats").onSnapshot(querySnapshot => {
        let myArr = [];
        let promises = [];
        let contactsArr = [];
        querySnapshot.forEach((doc) => {
          if(doc.id.indexOf(this.userEmailName) != -1) {
            contactsArr.push(doc.id);
          }
        });

        if(contactsArr.length) {
          for(let x = 0; x < contactsArr.length; x++) {
            let contactArr = contactsArr[x].toLowerCase();
            console.log('contactsArr', contactArr);
            const promise = new Promise((resolve, reject) => {
              this.db.collection("chats").doc(contactArr).collection('messages').orderBy("dateAdded", "desc").limit(1).onSnapshot(res => {
                let data = res.docs.map(data => data.data());
                if(res.docs.length) {
                  data[0]['chatId'] = contactArr;
                  let userArr = contactArr.split('-');
                  let userEmailName = userArr[0] == this.userEmailName ? userArr[1] : userArr[0];

                  this.db.collection("chats").doc(contactArr).collection('messages').get().then(chatRes => {
                    let chatUnreadCount = chatRes.docs.map(chatData => chatData.data()).filter(chatRead => chatRead.isRead == 0 && chatRead.userEmailName != this.userEmailName).length;
                    this.db.collection('users').get().then(res => {
                      let userData = res.docs.map(doc => doc.data());
                      let user = userData.filter(user => user.email.split('@')[0].replace('.', '').toLowerCase() == userEmailName.toLowerCase());
                      data[0]['userPhoto'] = user[0].photo;
                      data[0]['otherName'] = user[0].name;
                      data[0]['unreadCount'] = chatUnreadCount;
                      console.log('chatUnreadCount', chatUnreadCount);
                      myArr.map((arr, index) => {
                        if(arr.chatId == contactArr) {
                          myArr.splice(index, 1);
                        }
                      });

                      myArr.push(data[0]);
                      console.log('myArr', myArr);
                      resolve(1);
                    });
                  });

                }else {
                  this.chatLists = [];
                  this.pageLoaded = true;
                }
              });
            });

            promises.push(promise);
          }  
        }else {
          this.chatLists = [];
          this.pageLoaded = true;
        }

        Promise.all(promises).then(() => {
          this.chatLists = [];
          this.chatLists = myArr;

          function compare(a,b) {
            if (a.timestampInSecs < b.timestampInSecs)
              return -1;
            if (a.timestampInSecs > b.timestampInSecs)
              return 1;
            return 0;
          }
          
          this.chatLists.reverse(compare);
          
          console.log('this.chatLists', this.chatLists);
          this.pageLoaded = true;

        });
      });
  }

  onSearch(ev: any) {
    this.pageLoaded = false;
    let val = ev.target.value;

    // this.db.collection("chats").onSnapshot(querySnapshot => {
    //   let myArr = [];
    //   let promises = [];
    //   let contactsArr = [];
    //   querySnapshot.forEach((doc) => {
    //     if(doc.id.indexOf(this.userEmailName) != -1) {
    //       contactsArr.push(doc.id);
    //     }
    //   });
     
    //   if(contactsArr.length) {
    //     for(let x = 0; x < contactsArr.length; x++) {
    //       console.log('contactsArr', contactsArr[x]);
    //       const promise = new Promise((resolve, reject) => {
    //         this.db.collection("chats").doc(contactsArr[x]).collection('messages').orderBy("dateAdded", "desc").limit(1).onSnapshot(res => {
    //           let data = res.docs.map(data => data.data());
    //           if(res.docs.length) {
    //             data[0]['chatId'] = contactsArr[x];
    //             let userArr = contactsArr[x].split('-');
    //             let userEmailName = userArr[0] == this.userEmailName ? userArr[1] : userArr[0];

    //             this.db.collection("chats").doc(contactsArr[x]).collection('messages').get().then(chatRes => {
    //               let chatUnreadCount = chatRes.docs.map(chatData => chatData.data()).filter(chatRead => chatRead.isRead == 0 && chatRead.userEmailName != this.userEmailName).length;
    //               this.db.collection('users').get().then(res => {
    //                 let userData = res.docs.map(doc => doc.data());
    //                 let user = userData.filter(user => user.email.split('@')[0].replace('.', '').toLowerCase() == userEmailName.toLowerCase());
    //                 data[0]['userPhoto'] = user[0].photo;
    //                 data[0]['otherName'] = user[0].name;
    //                 data[0]['unreadCount'] = chatUnreadCount;
            
    //                 myArr.map((arr, index) => {
    //                   if(arr.chatId == contactsArr[x]) {
    //                     myArr.splice(index, 1);
    //                   }
    //                 });

    //                 myArr.push(data[0]);
    //                 console.log('myArr', myArr);
    //                 resolve(1);
    //               });
    //             });

    //           }else {
    //             this.chatLists = [];
    //             this.pageLoaded = true;
    //           }
    //         });
    //       });

    //       promises.push(promise);
    //     }  
    //   }else {
    //     this.chatLists = [];
    //     this.pageLoaded = true;
    //   }

    //   Promise.all(promises).then(() => {
    //     this.chatLists = [];
    //     this.chatLists = myArr;
        
    //     if (val && val.trim() != '') {
    //       this.chatLists =  this.chatLists.filter((el) => {
    //         return (el.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
    //                 el.otherName.toLowerCase().indexOf(val.toLowerCase()) > - 1);
    //       });
    //     }
  
    //     setTimeout(() => {
    //       this.pageLoaded = true;
    //     }, 700);
    //   });
    // });
    this.db.collection("chats").onSnapshot(querySnapshot => {
      let myArr = [];
      let promises = [];
      let contactsArr = [];
      querySnapshot.forEach((doc) => {
        if (doc.id.indexOf(this.userEmailName) != -1) {
          contactsArr.push(doc.id);
        }
      });

      if (contactsArr.length) {
        for (let x = 0; x < contactsArr.length; x++) {
          let contactArr = contactsArr[x].toLowerCase();
          console.log('contactsArr', contactArr);
          const promise = new Promise((resolve, reject) => {
            this.db.collection("chats").doc(contactArr).collection('messages').orderBy("dateAdded", "desc").limit(1).onSnapshot(res => {
              let data = res.docs.map(data => data.data());
              if (res.docs.length) {
                data[0]['chatId'] = contactArr;
                let userArr = contactArr.split('-');
                let userEmailName = userArr[0] == this.userEmailName ? userArr[1] : userArr[0];

                this.db.collection("chats").doc(contactArr).collection('messages').get().then(chatRes => {
                  let chatUnreadCount = chatRes.docs.map(chatData => chatData.data()).filter(chatRead => chatRead.isRead == 0 && chatRead.userEmailName != this.userEmailName).length;
                  this.db.collection('users').get().then(res => {
                    let userData = res.docs.map(doc => doc.data());
                    let user = userData.filter(user => user.email.split('@')[0].replace('.', '').toLowerCase() == userEmailName.toLowerCase());
                    data[0]['userPhoto'] = user[0].photo;
                    data[0]['otherName'] = user[0].name;
                    data[0]['unreadCount'] = chatUnreadCount;
                    console.log('chatUnreadCount', chatUnreadCount);
                    myArr.map((arr, index) => {
                      if (arr.chatId == contactArr) {
                        myArr.splice(index, 1);
                      }
                    });

                    myArr.push(data[0]);
                    console.log('myArr', myArr);
                    resolve(1);
                  });
                });

              } else {
                this.chatLists = [];
                this.pageLoaded = true;
              }
            });
          });

          promises.push(promise);
        }
      } else {
        this.chatLists = [];
        this.pageLoaded = true;
      }

      Promise.all(promises).then(() => {
        this.chatLists = [];
        this.chatLists = myArr;

        function compare(a, b) {
          if (a.timestampInSecs < b.timestampInSecs)
            return -1;
          if (a.timestampInSecs > b.timestampInSecs)
            return 1;
          return 0;
        }

        this.chatLists.reverse(compare);

        if (val && val.trim() != '') {
          this.chatLists =  this.chatLists.filter((el) => {
            return (el.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                    el.otherName.toLowerCase().indexOf(val.toLowerCase()) > - 1);
          });
        }

        setTimeout(() => {
          this.pageLoaded = true;
        }, 700);
      });
    });
  }
}
