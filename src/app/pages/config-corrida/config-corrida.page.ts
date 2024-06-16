import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(private location: Location, private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

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

 async salvar(){
    try {
      const user = await this.afAuth.currentUser;
      if (user) {

        const userId = user.uid;

        await this.firestore.collection('configuracoes').doc(userId).set({
          user_id: userId,
          pausaAutomatica: this.configuracoes.pausaAutomatica,
          contagemRegressiva: this.configuracoes.contagemRegressiva,
          tipoVoz: this.configuracoes.tipoVoz,
          frequenciaAudio: this.configuracoes.frequenciaAudio,
          duracaoComentario: this.configuracoes.duracaoComentario,
          distanciaComentario: this.configuracoes.distanciaComentario,
          ritmoComentario: this.configuracoes.ritmoComentario,
          medidor: this.configuracoes.medidor,
          meta: this.configuracoes.meta
        });

      } 
      
      else {
        console.error("Usuário não autenticado");
      }
    } catch (error) {
      console.error("Erro ao salvar os dados: ", error);
    }
  }

}