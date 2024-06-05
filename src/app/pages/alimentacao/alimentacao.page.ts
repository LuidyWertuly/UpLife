import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-alimentacao',
  templateUrl: './alimentacao.page.html',
  styleUrls: ['./alimentacao.page.scss'],
})
export class AlimentacaoPage implements OnInit {
  alimento: any;
  descricaoAlimento: string;

  constructor(private router: Router, private http: HttpClient) {
    this.descricaoAlimento = '';
  }

  ngOnInit() {
  }

  IrparaConfig(){
    this.router.navigate(['configuracoes'])
  }

  pesquisarAlimento(descricao: string) {
    this.http.get(`http://localhost:3000/${descricao}`).subscribe(data => {
      this.alimento = data;
    });
  }
}