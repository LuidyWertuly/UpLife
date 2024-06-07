import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-editar-conta',
  templateUrl: './editar-conta.page.html',
  styleUrls: ['./editar-conta.page.scss'],
})
export class EditarContaPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
  }

  Voltarpagina(){
    this.location.back();
  }

  confirmar(salvar: boolean) {
    
    if (salvar) {
      // Lógica para salvar as alterações
      console.log('Alterações salvas');
    } 
    
    else {
      // Lógica para descartar as alterações
      console.log('Alterações descartadas');
    }
    this.modal.dismiss();

    setTimeout(() => {
      this.router.navigate(['esqueci-senha']);
    }, 300);

  }

}
