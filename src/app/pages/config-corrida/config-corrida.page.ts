import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-config-corrida',
  templateUrl: './config-corrida.page.html',
  styleUrls: ['./config-corrida.page.scss'],
})

export class ConfigCorridaPage implements OnInit {

  placeholderMeta: string = 'Desativado';

  configuracoes: any = {
    pausaAutomatica: false,
    contagemRegressiva: 'desativada',
    tipoVoz: 'desativado',
    frequenciaAudio: '1km',
    duracaoComentario: false,
    distanciaComentario: false,
    ritmoComentario: false,
    medidor: 'nenhum',
    meta: ''
  };

  constructor(private location: Location) {}

  ngOnInit() {
    this.atualizarPlaceholder();
  }

  Voltarpagina() {
    this.location.back();
  }

  atualizarPlaceholder() {
    if (this.configuracoes.medidor === 'nenhum') {
      this.placeholderMeta = 'Desativado';
    } 
    
    else if (this.configuracoes.medidor === 'distancia') {
      this.placeholderMeta = 'Distância | KM';
    } 
    
    else if (this.configuracoes.medidor === 'duracao') {
      this.placeholderMeta = 'Duração | Min';
    }
  }

}