import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import * as firebase from 'firebase';
import * as clarifai from 'clarifai';
import { VideoPlayer } from '@ionic-native/video-player';
import { StreamingMedia } from '@ionic-native/streaming-media';

// Plugins
import { Geolocation } from '@ionic-native/geolocation';
import { Badge } from '@ionic-native/badge';

// Components
import { MyApp } from './app.component';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { AddLostPetFormPage } from '../pages/add-lost-pet-form/add-lost-pet-form';
import { PlaceDetailPage } from '../pages/place-detail/place-detail';
import { LostPetDetailsPage } from '../pages/lost-pet-details/lost-pet-details';
import { AddForSalePetPage } from '../pages/add-for-sale-pet/add-for-sale-pet';
import { BuyPetDetailsPage } from '../pages/buy-pet-details/buy-pet-details';
import { RegisterPetFormPage } from '../pages/register-pet-form/register-pet-form';
import { RegisteredPetDetailsPage } from '../pages/registered-pet-details/registered-pet-details';
import { AdminViewProfilePage } from '../pages/admin-view-profile/admin-view-profile';
import { AdminViewUserRegisteredPetsPage } from '../pages/admin-view-user-registered-pets/admin-view-user-registered-pets';
import { EditForSalePetPage } from '../pages/edit-for-sale-pet/edit-for-sale-pet';
import { EditLostPetPage } from '../pages/edit-lost-pet/edit-lost-pet';
import { EditRegisteredPetPage } from '../pages/edit-registered-pet/edit-registered-pet';
import { AddVaccinationScheduleFormPage } from '../pages/add-vaccination-schedule-form/add-vaccination-schedule-form';
import { EditVaccinationSchedPage } from '../pages/edit-vaccination-sched/edit-vaccination-sched';
import { AdminAddGroomPetPage } from '../pages/admin-add-groom-pet/admin-add-groom-pet';
import { EditGroomPetPage } from '../pages/edit-groom-pet/edit-groom-pet';
import { AdminAddTrainPetPage } from '../pages/admin-add-train-pet/admin-add-train-pet';
import { EditTrainPetPage } from '../pages/edit-train-pet/edit-train-pet';

// Providers
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { GoogleCloudVisionProvider } from '../providers/google-cloud-vision/google-cloud-vision';
import { LostpetProvider } from '../providers/lostpet/lostpet';
import { BuypetProvider } from '../providers/buypet/buypet';
import { RegisterPetProvider } from '../providers/register-pet/register-pet';
import { AdminProvider } from '../providers/admin/admin';
import { VaccineProvider } from '../providers/vaccine/vaccine';
import { ChatProvider } from '../providers/chat/chat';
import { ChatNotifFabPage } from '../pages/chat-notif-fab/chat-notif-fab';


// Firebase Setup
const config = {
  apiKey: "AIzaSyCEc_GbF6xYYsd82ddTLgoFU0DNsGUXbpc",
  authDomain: "purrspaws-87594.firebaseapp.com",
  databaseURL: "https://purrspaws-87594.firebaseio.com",
  projectId: "purrspaws-87594",
  storageBucket: "purrspaws-87594.appspot.com",
  messagingSenderId: "1015253898291"
};

// Dev01
// const config = {
//   apiKey: "AIzaSyBdAMc_GPRd0ajgNmtzhybsOZ82QpAlXd0",
//   authDomain: "purrspawdev01.firebaseapp.com",
//   databaseURL: "https://purrspawdev01.firebaseio.com",
//   projectId: "purrspawdev01",
//   storageBucket: "purrspawdev01.appspot.com",
//   messagingSenderId: "744188651812"
// };

firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    EditprofilePage,
    AddLostPetFormPage,
    PlaceDetailPage,
    LostPetDetailsPage,
    AddForSalePetPage,
    BuyPetDetailsPage,
    RegisterPetFormPage,
    RegisteredPetDetailsPage,
    AdminViewProfilePage,
    AdminViewUserRegisteredPetsPage,
    EditForSalePetPage,
    EditLostPetPage,
    EditRegisteredPetPage,
    AddVaccinationScheduleFormPage,
    EditVaccinationSchedPage,
    AdminAddGroomPetPage,
    EditGroomPetPage,
    AdminAddTrainPetPage,
    EditTrainPetPage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      tabsHideOnSubPages: true
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EditprofilePage,
    AddLostPetFormPage,
    PlaceDetailPage,
    LostPetDetailsPage,
    AddForSalePetPage,
    BuyPetDetailsPage,
    RegisterPetFormPage,
    RegisteredPetDetailsPage,
    AdminViewProfilePage,
    AdminViewUserRegisteredPetsPage,
    EditForSalePetPage,
    EditLostPetPage,
    EditRegisteredPetPage,
    AddVaccinationScheduleFormPage,
    EditVaccinationSchedPage,
    AdminAddGroomPetPage,
    EditGroomPetPage,
    AdminAddTrainPetPage,
    EditTrainPetPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProfileProvider,
    GoogleCloudVisionProvider,
    Geolocation,
    LostpetProvider,
    BuypetProvider,
    RegisterPetProvider,
    AdminProvider,
    VideoPlayer,
    StreamingMedia,
    VaccineProvider,
    ChatProvider,
    Badge
  ]
})
export class AppModule {}
