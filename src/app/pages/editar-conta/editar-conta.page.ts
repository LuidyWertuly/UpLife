import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-conta',
  templateUrl: './editar-conta.page.html',
  styleUrls: ['./editar-conta.page.scss'],
})
export class EditarContaPage implements OnInit {

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
  }

  Voltarpagina(){
    this.location.back();
  }

}
