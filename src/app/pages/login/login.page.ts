import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private http: HttpClient, private afAuth: AngularFireAuth){

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    }) 

    this.errorMessage = '';

  }

  ngOnInit() {
  }

  Voltarpagina(){
    this.router.navigate(['home']);
  }

  irParaRegistro(){
    this.router.navigate(['registro']);
  }

  irParaEsqueciSenha(){
    this.router.navigate(['esqueci-senha']);
  }

  errorMessage: string;

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
  
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, senha);
  
        if (userCredential) {
          const user = userCredential.user;
  
          if (user) {
            const idToken = await user.getIdToken();
            this.http.post('http://localhost:3200/login', { idToken })
              .subscribe(response => {
                console.log(response);
                this.router.navigate(['home']);
              }, error => {
                console.error(error);
                this.errorMessage = error.error.message;
              });
          } else {
            throw new Error('Usuário não encontrado após autenticação');
          }
        } else {
          throw new Error('Credenciais de usuário não encontradas após autenticação');
        }
  
      } catch (error: any) {
        console.error(error);
        this.errorMessage = error.message;
      }
      
  
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  
  
  
}
