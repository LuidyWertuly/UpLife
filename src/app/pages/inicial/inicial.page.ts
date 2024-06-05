import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  constructor(private router: Router){}

  ngOnInit() {
  }

  IrparaRegistro(){
    this.router.navigate(['registro'])
  }

  IrparaLogin(){
    this.router.navigate(['login'])
  }

}
