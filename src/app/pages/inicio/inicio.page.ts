import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  fotoperfil: string = 'https://firebasestorage.googleapis.com/v0/b/uplife-f9bce.appspot.com/o/avatar.jpg?alt=media&token=07e7956f-aed7-4f78-80ff-b41e60e7226a';

  corrida: any = {}


  constructor(private router: Router, private firestore: AngularFirestore, private afAuth: AngularFireAuth){
  }

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      
      if (user) {
        this.firestore.collection('users', ref => ref.where('user_id', '==', user.uid)).get().subscribe(snapshot => {
          // console.log('Autenticado');
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data: any = doc.data();
            // console.log('Documento existe');

            if (data && data.fotoPerfil) {
              this.fotoperfil = data.fotoPerfil;
            } 
            
            else {
              console.log('Campo fotoPerfil não encontrado nos dados do usuário');
            }

          } 
          
          else {
            console.log('Documento do usuário não encontrado');
          }

        }, error => {
          console.error('Erro ao buscar documento do usuário:', error);
        });

        this.afAuth.authState.subscribe(user => {
          if (user) {
            this.firestore.collection('corridas', ref => ref.where('user_id', '==', user.uid).orderBy('data', 'desc').limit(1))
              .get()
              .subscribe(snapshot => {
                // console.log('Autenticado');
                if (!snapshot.empty) {
                  const doc = snapshot.docs[0];
                  const data: any = doc.data();
                  // console.log('Última corrida encontrada:', data);

                  this.corrida = {
                    dia: data.data,
                    hora: data.hora,
                    distancia: data.distancia,
                    duracao: data.duracao,
                    paceMedio: data.ritmoMedio,
                    calorias: data.calorias,
                  };   
                } 
                
                else {
                  // console.log('Nenhuma corrida encontrada para este usuário.');
                  this.corrida = null;
                }
              }, error => {
                 console.error('Erro ao buscar última corrida:', error);
              });
    
          } 
          
          else {
            console.log('Usuário não autenticado');
          }
        }, error => {
          console.error('Erro ao verificar estado de autenticação:', error);
        });

      }
      
      else {
        console.log('Usuário não autenticado');
      }
    }, error => {
      console.error('Erro ao verificar estado de autenticação:', error);
    });

  }

  IrparaConfig(){
    this.router.navigate(['configuracoes'])
  }

  irParaCorrida(){
    this.router.navigate(['home/tabsCorrida/corrida'])
  }

  irParaHistorico(){
    this.router.navigate(['home/tabsCorrida/historico'])
  }

}
