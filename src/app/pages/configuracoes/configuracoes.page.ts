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

}
