import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';

interface User {
  email: string;
  nome: string;
  senha: string;
  fotoPerfil: string;
}

function nomeValidator(control: AbstractControl) {
  const nome = control.value;
  const regex = /^(.*[a-zA-Z].*){5,}$/;
  if (!regex.test(nome)) {
    return { 'nomeInvalido': true };
  }
  return null;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  userForm: FormGroup;

  constructor(private location: Location, private router: Router, private formBuilder: FormBuilder, private http: HttpClient){

    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', [Validators.required, Validators.minLength(5), nomeValidator]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this.verificarSenha });
    

    this.user = {
      email: '',
      nome: '',
      senha: '',
      fotoPerfil: 'https://firebasestorage.googleapis.com/v0/b/uplife-f9bce.appspot.com/o/avatar.jpg?alt=media&token=07e7956f-aed7-4f78-80ff-b41e60e7226a',
    };

    this.emailErro ='';

  }

  ngOnInit() {
  }

  Voltarpagina(){
    this.location.back();
  }

  irParaLogin(){
    this.router.navigate(['login']);
  }

  verificarSenha(formGroup: FormGroup) {

    const senhaControl = formGroup.get('senha');
    const confirmarSenhaControl = formGroup.get('confirmarSenha');
  
    if (senhaControl && confirmarSenhaControl) {

      const senha = senhaControl.value;
      const confirmarSenha = confirmarSenhaControl.value;
  
      if (senha !== confirmarSenha) {
        confirmarSenhaControl.setErrors({ verificarSenha: true });
      } 
      
      else {
        confirmarSenhaControl.setErrors(null);
      }

    }
  }

  user: User;
  emailErro: string;

  onSubmit(){
    if (this.userForm.valid){
      let user = { ...this.userForm.value };
      user.fotoPerfil = this.user.fotoPerfil;
      delete user.confirmarSenha;

      this.http.post('http://localhost:3300/registro1', user)
      .subscribe(response => {
        console.log(response);
        
        this.router.navigate(['mais-info']);
        
      }, error => {
        console.error(error);
        this.emailErro = error.error.message;
      });
    }

    else {
      this.userForm.markAllAsTouched();
    }
  }
}
