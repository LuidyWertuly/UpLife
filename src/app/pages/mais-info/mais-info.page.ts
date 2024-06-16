import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mais-info',
  templateUrl: './mais-info.page.html',
  styleUrls: ['./mais-info.page.scss'],
})
export class MaisInfoPage implements OnInit {

  userForm: FormGroup;

  constructor(private location: Location, private router: Router, private formBuilder: FormBuilder, private http: HttpClient){

    this.userForm = this.formBuilder.group({
      DTnascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      atividade: ['', Validators.required],
      objetivo: ['', Validators.required],
    });

  }

  ngOnInit() {
  }

  Voltarpagina(){
    this.location.back();
  }

  onSubmit(){
    if (this.userForm.valid) {
      let user = { ...this.userForm.value };

      this.http.post('http://localhost:3300/registro2', user)
      .subscribe((response:any) => {
        console.log(response);
        
        if (response.isGoogleUser) {
          this.router.navigate(['home']);
        } 
        
        else {
          this.router.navigate(['login']);
        }
        
      }, error => {
        console.error(error);
      });
    }

    else {
      this.userForm.markAllAsTouched();
    }
  }

}
