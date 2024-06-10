import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  constructor(private router: Router, private afAuth: AngularFireAuth, private http: HttpClient){}

  ngOnInit() {
  }

  IrparaRegistro(){
    this.router.navigate(['registro'])
  }

  IrparaLogin(){
    this.router.navigate(['login'])
  }

  loginComGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        if (result.user) { // Verificar se user não é null
          const userGoogleData = result.user;
          const userData = {
            nome: userGoogleData.displayName,
            fotoPerfil: userGoogleData.photoURL,
            dataNascimento: 'N/A'  // Isso precisa ser ajustado conforme a disponibilidade
          };
  
          // Enviando os dados para o backend
          this.enviarDadosUsuario(userData);
        } else {
          console.error('Nenhum usuário retornado do Google login');
        }
      })
      .catch((error) => {
        console.error('Erro ao fazer login com o Google:', error);
      });
  }

  enviarDadosUsuario(userData: any) {
    this.http.post('http://localhost:3300/registro1', userData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['mais-info']);
      }, error => {
        console.error(error);
      });
  }

}
