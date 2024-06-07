import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonModal, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-conta',
  templateUrl: './editar-conta.page.html',
  styleUrls: ['./editar-conta.page.scss'],
})
export class EditarContaPage implements OnInit {

  @ViewChild('modal') modal!: IonModal;

  @ViewChild('senhaModal') senhaModal!: IonModal;

  @ViewChild('emailModal') emailModal!: IonModal;

  userForm: FormGroup;

  uid: string;

  constructor(private location: Location, private router: Router, private afAuth: AngularFireAuth, private firestore: AngularFirestore, private fb: FormBuilder, private toastController: ToastController){
    
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      DTnascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      atividade: ['', Validators.required],
      objetivo: ['', Validators.required]
    });

    this.uid = '';

  }

  ngOnInit(){
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.uid = user.uid;
        this.loadUserData();
      }
    });
  }

  Voltarpagina(){
    this.location.back();
  }

  loadUserData() {
    this.firestore.collection('users').doc(this.uid).valueChanges().subscribe(userData => {
      if (userData) {
        this.userForm.patchValue(userData);
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  cancelar() {
    this.userForm.reset();
    this.router.navigate(['home']);
  }

  async confirmar(salvar: boolean) {
    if (salvar) {
      try {
        await this.firestore.collection('users').doc(this.uid).update(this.userForm.value);
        await this.showToast('Alterações salvas com sucesso!');
      } catch (error) {
        await this.showToast('Erro ao salvar alterações!');
        console.error('Error updating user data:', error);
      }
    }
    
    else {
      this.showToast('Alterações descartadas');
    }

    this.modal.dismiss();

    setTimeout(() => {
      this.router.navigate(['inicio']);
    }, 300);
  }

  async irparaMudarSenha(salvar: boolean){
    if (salvar) {
      try {
        await this.firestore.collection('users').doc(this.uid).update(this.userForm.value);
        await this.showToast('Alterações salvas com sucesso!');
      } catch (error) {
        await this.showToast('Erro ao salvar alterações!');
        console.error('Error updating user data:', error);
      }
    } 
    
    else {
      this.userForm.reset();
    }

    this.senhaModal.dismiss();

    setTimeout(() => {
      this.router.navigate(['esqueci-senha']);
    }, 300);
  }

  async irparaMudarEmail(salvar: boolean){
    if (salvar) {
      try {
        await this.firestore.collection('users').doc(this.uid).update(this.userForm.value);
        await this.showToast('Alterações salvas com sucesso!');
      } catch (error) {
        await this.showToast('Erro ao salvar alterações!');
        console.error('Error updating user data:', error);
      }
    } 
    
    else {
      this.userForm.reset();
    }

    this.emailModal.dismiss();

    setTimeout(() => {
      this.router.navigate(['mudar-email']);
    }, 300);
  }

}
