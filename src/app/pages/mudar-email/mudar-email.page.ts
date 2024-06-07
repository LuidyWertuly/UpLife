import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mudar-email',
  templateUrl: './mudar-email.page.html',
  styleUrls: ['./mudar-email.page.scss'],
})
export class MudarEmailPage implements OnInit {

  emailForm: FormGroup;

  constructor(private location: Location, private router: Router, private formBuilder: FormBuilder, private afAuth: AngularFireAuth, private alertController: AlertController, private afs: AngularFirestore){
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(){
    this.afAuth.authState.subscribe(user => {
      if (user && user.emailVerified) {
        this.router.navigate(['/']);
      }
    });
  }

  Voltarpagina(){
    this.location.back();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async onSubmit() {
    if (this.emailForm.valid) {
      const newEmail = this.emailForm.get('email')?.value;

      try {
        const user = await this.afAuth.currentUser;
        if (user !== null) {
          // Enviar e-mail de verificação para o novo e-mail
          await user.verifyBeforeUpdateEmail(newEmail);

          // Atualizar o e-mail no Firestore
          await this.afs.collection('users').doc(user.uid).update({ email: newEmail });

          // Informar o usuário que um e-mail de verificação foi enviado
          this.presentAlert(
            'Sucesso',
            'Um e-mail de verificação foi enviado para o novo endereço de e-mail. Por favor, verifique sua caixa de entrada e siga as instruções.'
          );
        } else {
          console.error('Usuário atual é nulo');
          this.presentAlert(
            'Erro',
            'Ocorreu um erro ao atualizar o endereço de e-mail. Por favor, tente novamente mais tarde.'
          );
        }
      } catch (error) {
        console.error('Erro ao atualizar o e-mail:', error);
        this.presentAlert(
          'Erro',
          'Ocorreu um erro ao atualizar o endereço de e-mail. Por favor, tente novamente mais tarde.'
        );
      }
    } else {
      this.emailForm.markAllAsTouched();
    }
  }
    
}
