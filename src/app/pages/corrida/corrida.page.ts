import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-corrida',
  templateUrl: './corrida.page.html',
  styleUrls: ['./corrida.page.scss'],
})
export class CorridaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  IrparaConfig(){
    this.router.navigate(['configuracoes'])
  }

  IrparaHistorico(){
    this.router.navigate(['home/historico'])
  }

  IrparaConfigCorrida(){
    this.router.navigate(['config-corrida'])
  }

  IrparaTenis(){
    this.router.navigate(['tenis'])
  }

}
