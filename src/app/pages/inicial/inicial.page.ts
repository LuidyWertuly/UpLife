import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  constructor(private router: Router, private afAuth: AngularFireAuth, private firestore: AngularFirestore, private http: HttpClient){}

  ngOnInit() {}

  IrparaRegistro(){
    this.router.navigate(['registro'])
  }

  IrparaLogin(){
    this.router.navigate(['login'])
  }

  async loginComGoogle() {
    try {
      const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

      if (result.user) {
        const userGoogleData = result.user;
        const userDoc = await this.firestore.collection('users').doc(userGoogleData.uid).get().toPromise();

        if (userDoc && userDoc.exists) {
          // Dados do usuário já existem no Firestore
          this.router.navigate(['home']);
        } else {
          // Dados do usuário não existem no Firestore, salvar temporariamente no backend
          const userData = {
            user_id: userGoogleData.uid,
            nome: userGoogleData.displayName,
            email: userGoogleData.email,
            fotoPerfil: userGoogleData.photoURL,
          };

          // Enviando os dados para o backend
          this.enviarDadosUsuario(userData);
        }
      } else {
        console.error('Nenhum usuário retornado do Google login');
      }
    } catch (error) {
      console.error('Erro ao fazer login com o Google:', error);
    }
  }

  enviarDadosUsuario(userData: any) {
    this.http.post('http://localhost:3300/registroGoogle', userData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['mais-info']);
      }, error => {
        console.error(error);
      });
  }
}
