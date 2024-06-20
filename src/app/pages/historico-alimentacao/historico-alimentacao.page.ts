import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

interface Alimento {
  id: string;
  descricao: string;
  carboidrato_g: number;
  energia_kcal: number;
  gordura_g: number;
  proteina_g: number;
  tipoRefeicao: string;
  dataHora: Date;
}

interface AlimentosPorData {
  [key: string]: { data: Date, alimentosPorRefeicao: { [key: string]: Alimento[] } };
}

@Component({
  selector: 'app-historico-alimentacao',
  templateUrl: './historico-alimentacao.page.html',
  styleUrls: ['./historico-alimentacao.page.scss'],
})
export class HistoricoAlimentacaoPage implements OnInit {

  alimentos: Alimento[] = [];
  alimentosPorData: AlimentosPorData = {};
  datas: string[] = []; // Adiciona esta propriedade

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore.collection('alimentacao', ref => ref.where('user_id', '==', user.uid))
          .get()
          .subscribe(
            (snapshot) => {
              this.alimentos = [];
              snapshot.forEach(doc => {
                const data: any = doc.data();

                const alimento: Alimento = {
                  id: doc.id,
                  descricao: data.description,
                  carboidrato_g: parseFloat(data.carbohydrate_g),
                  energia_kcal: parseFloat(data.energy_kcal),
                  gordura_g: parseFloat(data.lipid_g),
                  proteina_g: parseFloat(data.protein_g),
                  tipoRefeicao: data.tipoRefeicao,
                  dataHora: (data.dataHora as firebase.firestore.Timestamp).toDate()
                };

                this.alimentos.push(alimento);
              });

              this.organizarAlimentosPorData();
              console.log('Alimentos organizados por data:', this.alimentosPorData);
            },
            (error) => {
              console.error('Erro ao buscar alimentos do usuário:', error);
            }
          );
      }
    });
  }

  organizarAlimentosPorData() {
    this.alimentosPorData = {};

    this.alimentos.forEach(alimento => {
      const dataString = alimento.dataHora.toISOString().split('T')[0]; // Converte a data para uma string no formato 'yyyy-mm-dd'
      
      if (!this.alimentosPorData[dataString]) {
        this.alimentosPorData[dataString] = { data: alimento.dataHora, alimentosPorRefeicao: { 'Café Da Manhã': [], 'Almoço': [], 'Jantar': [], 'Lanches/Outros': [] } };
      }

      if (this.alimentosPorData[dataString].alimentosPorRefeicao[alimento.tipoRefeicao]) {
        this.alimentosPorData[dataString].alimentosPorRefeicao[alimento.tipoRefeicao].push(alimento);
      } else {
        console.warn(`Tipo de refeição desconhecido: ${alimento.tipoRefeicao}`);
      }
    });

    this.datas = Object.keys(this.alimentosPorData); // Atualiza a lista de datas
  }

  getIconForRefeicao(tipoRefeicao: string): { name: string, cssClass: string } {
    switch (tipoRefeicao) {
      case 'Café Da Manhã': return { name: 'cafe', cssClass: 'cafe' };
      case 'Almoço': return { name: 'sunny', cssClass: 'sunny' };
      case 'Jantar': return { name: 'moon', cssClass: 'moon' };
      case 'Lanches/Outros': return { name: 'nutrition', cssClass: 'nutrition' };
      default: return { name: 'restaurant', cssClass: 'default' };
    }
  }

  getFormattedId(tipoRefeicao: string): string {
    return tipoRefeicao.toLowerCase().replace(/\//g, '');
  }
}
