import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  fotoperfil: string = 'https://firebasestorage.googleapis.com/v0/b/uplife-f9bce.appspot.com/o/avatar.jpg?alt=media&token=07e7956f-aed7-4f78-80ff-b41e60e7226a';

  temaSelecionado: string = 'claro';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private location: Location, private router: Router, private firestore: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage) { }

  ngOnInit() {
    
    this.afAuth.authState.subscribe(user => {
      
      if (user) {
        this.firestore.collection('users', ref => ref.where('user_id', '==', user.uid)).get().subscribe(snapshot => {
          console.log('Autenticado');

          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data: any = doc.data();
            console.log('Documento existe');

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

      }
      
      else {
        console.log('Usuário não autenticado');
      }
    }, error => {
      console.error('Erro ao verificar estado de autenticação:', error);
    });

  }

  Voltarpagina(){
    this.location.back();
  }

  mudarTema(tema: string) {
    this.temaSelecionado = tema;
  }

  IrparaConfigCorrida(){
    this.router.navigate(['config-corrida'])
  }

  alterarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const filePath = `profile_pictures/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.fotoperfil = url;
            this.afAuth.currentUser.then(user => {
              if (user) {
                this.firestore.collection('users', ref => ref.where('user_id', '==', user.uid)).get().subscribe(snapshot => {
                  if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    doc.ref.update({ fotoPerfil: url });
                  }
                });
              }
            });
          });
        })
      ).subscribe();
    }
  }

  deletarConta() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        // Obtém os dados do usuário do Firestore
        this.firestore.collection('users', ref => ref.where('user_id', '==', user.uid)).get().subscribe(snapshot => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data: any = doc.data();
  
            // Verifica se o campo fotoPerfil está presente nos dados do usuário
            if (data && data.fotoPerfil) {
              // Exclui a foto de perfil do Firebase Storage
              this.storage.refFromURL(data.fotoPerfil).delete().toPromise().then(() => {
                console.log('Foto de perfil excluída com sucesso.');
  
                // Exclui conta de autenticação
                user.delete().then(() => {
                  console.log('Conta de autenticação excluída com sucesso.');
                  // Exclui dados do Firestore associados ao usuário
                  doc.ref.delete().then(() => {
                    console.log('Dados do Firestore excluídos com sucesso.');
                    // Redirecionar para a página de login
                    this.router.navigate(['/inicial']); // Altere para a página de login
                  }).catch(error => {
                    console.error('Erro ao excluir dados do Firestore:', error);
                  });
                }).catch(error => {
                  if (error.code === 'auth/requires-recent-login') {
                    // Redirecionar para a página de login
                    this.router.navigate(['/login']); // Altere para a página de login
                  } else {
                    console.error('Erro ao excluir conta de autenticação:', error);
                  }
                });
              }).catch(error => {
                console.error('Erro ao excluir foto de perfil:', error);
              });
            } else {
              console.log('Campo fotoPerfil não encontrado nos dados do usuário.');
            }
          } else {
            console.log('Documento do usuário não encontrado.');
          }
        }, error => {
          console.error('Erro ao buscar documento do usuário:', error);
        });
      } else {
        console.error('Nenhum usuário autenticado.');
      }
    }).catch(error => {
      console.error('Erro ao obter o usuário atual:', error);
    });
  }
  


  sairConta(){
    
  }

}
