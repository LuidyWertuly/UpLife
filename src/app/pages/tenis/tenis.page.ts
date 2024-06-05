import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tenis',
  templateUrl: './tenis.page.html',
  styleUrls: ['./tenis.page.scss'],
})

export class TenisPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  Voltarpagina(){
    this.location.back();
  }

}
