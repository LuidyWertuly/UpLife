import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  IrparaConfig(){
    this.router.navigate(['configuracoes'])
  }

  IrparaCorrida(){
    this.router.navigate(['home/corrida'])
  }

}
