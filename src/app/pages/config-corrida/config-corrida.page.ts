import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-config-corrida',
  templateUrl: './config-corrida.page.html',
  styleUrls: ['./config-corrida.page.scss'],
})

export class ConfigCorridaPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  Voltarpagina(){
    this.location.back();
  }

}
