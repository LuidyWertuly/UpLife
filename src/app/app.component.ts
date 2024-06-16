import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router){
  this.afAuth.authState.subscribe(user => {
     if (user) {
       this.router.navigate(['home']); //Redirecionar para a página home se o usuário estiver autenticado
     } else {
       this.router.navigate(['inicial']); //Redirecionar para a página inicial se o usuário não estiver autenticado
     }
   });
  }
}
