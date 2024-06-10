import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-corrida',
  templateUrl: './corrida.page.html',
  styleUrls: ['./corrida.page.scss'],
})
export class CorridaPage implements OnInit{

  map: any;
  userMarker: any;
  watchId: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos: L.LatLngTuple = [position.coords.latitude, position.coords.longitude];
  
        this.map = L.map('map', {
          center: pos,
          zoom: 18,
          zoomControl: false,
          attributionControl: false,
          //dragging: false,
          //scrollWheelZoom: false
        });
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '',
        }).addTo(this.map);
  
        this.userMarker = L.circleMarker(pos, {
          radius: 8,
          fillColor: '#4285F4',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(this.map);
  
        this.watchPosition();
      }, (error) => {
        console.error(error);
      }, {
        enableHighAccuracy: true
      });
    } 
    
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  

  watchPosition() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition((position) => {
        const pos = [position.coords.latitude, position.coords.longitude];

        this.userMarker.setLatLng(pos);
        this.map.setView(pos);
      }, (error) => {
        console.error(error);
      }, {
        enableHighAccuracy: true
      });
    } 
    
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  IrparaConfig() {
    this.router.navigate(['configuracoes']);
  }

  IrparaHistorico() {
    this.router.navigate(['home/historico']);
  }

  IrparaConfigCorrida() {
    this.router.navigate(['config-corrida']);
  }

  IrparaTenis() {
    this.router.navigate(['tenis']);
  }
}
