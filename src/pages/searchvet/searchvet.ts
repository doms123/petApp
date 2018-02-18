import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation'; 
import { PlaceDetailPage } from '../place-detail/place-detail';

declare var google;

@IonicPage()
@Component({
  selector: 'page-searchvet',
  templateUrl: 'searchvet.html',
})
export class SearchvetPage {
  options: GeolocationOptions;
  currentPos: Geoposition;
  places: Array<any>; 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  pageLoaded: boolean = false;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, public modalCtrl: ModalController) {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.getUserPosition();
    }, 400);
  }  

  getVetClinic(latLng) {
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
      location: latLng,
      radius: 8047,
      types: ["veterinary_care"]
    };
    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.pageLoaded = true;
          resolve(results);
        } else {
          reject(status);
        }

      });
    });
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.currentPos = pos;
      this.addMap(pos.coords.latitude, pos.coords.longitude);
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
  }

  addMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.getVetClinic(latLng).then((results: Array<any>) => {
      this.places = results;
      for (let i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }, (status) => console.log(status));

    this.addMarker();
  }

  createMarker(place) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });
    let placeName = place.name;
    let vicinity = place.vicinity;



    let content = `${placeName} (${vicinity})`;
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  } 

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  placeDetail(place) {
    let modal = this.modalCtrl.create(PlaceDetailPage, place);

    modal.onDidDismiss(data => {
      if (data) {
        // this.loadProfile();
      }
    });

    modal.present();
  }
}
