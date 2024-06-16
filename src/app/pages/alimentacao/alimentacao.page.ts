import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { TextFieldTypes } from '@ionic/core';

@Component({
  selector: 'app-alimentacao',
  templateUrl: './alimentacao.page.html',
  styleUrls: ['./alimentacao.page.scss'],
})
export class AlimentacaoPage implements OnInit {
  DetalheAlimento = false;
  alimento: any;
  descricaoAlimento: string;
  alimentos: any[] = [];
  alertInputs = [
    {
      name: 'alimento',
      type: 'text' as TextFieldTypes,
      placeholder: 'Alimento'
    },
    {
      name: 'gramas',
      type: 'number' as TextFieldTypes,
      placeholder: 'Gramas',
      required: true
    }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    public alertController: AlertController
  ) {
    this.descricaoAlimento = '';
    this.carregarAlimentos();
  }

  ngOnInit() {}

  carregarAlimentos() {
    this.http.get('assets/TACO.json').subscribe((data: any) => {
      this.alimentos = data;
    });
  }

  pesquisarAlimento(descricao: string) {
    this.http.get(`http://localhost:3000/${descricao}`).subscribe(data => {
      this.alimento = data;
    });
  }

  abrirDetalheAlimento(status: boolean) {
    this.DetalheAlimento = true;
  }

  async abrirAlerta(mealType: string) {
    const alert = await this.alertController.create({
      header: 'Insira o alimento e a quantidade',
      inputs: this.alertInputs,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            const alimento = this.alimentos.find(a => a.description.toLowerCase() === data.alimento.toLowerCase());
            if (alimento && data.gramas) {
              const gramas = parseFloat(data.gramas);
              const fator = gramas / 100;
              const calorias = (alimento.energy_kcal * fator).toFixed(2);
              const proteina = (alimento.protein_g * fator).toFixed(2);
              const gordura = (alimento.lipid_g * fator).toFixed(2);
              const carboidratos = (alimento.carbohydrate_g * fator).toFixed(2);
  
              // Adiciona os valores calculados ao acordeão
              this.adicionarAlimentoAcordeao({
                ...alimento,
                energy_kcal: calorias,
                protein_g: proteina,
                lipid_g: gordura,
                carbohydrate_g: carboidratos
              }, mealType);
            } else {
              console.warn('Alimento não encontrado ou quantidade em gramas não informada!');
            }
          }
        }
      ]
    });

    // Adiciona um event listener para o input do alert para as sugestões
    alert.addEventListener('didPresent', () => {
      const inputField: any = document.querySelector('ion-alert input');
      if (inputField) {
        inputField.addEventListener('input', (event: any) => {
          this.filtrarSugestoes(event.target.value);
        });
      }
    });

    await alert.present();
  }

  filtrarSugestoes(inputValue: string) {
    const inputField = document.querySelector('ion-alert input');
    const sugestões = this.alimentos
      .filter(a => a.description.toLowerCase().includes(inputValue.toLowerCase()))
      .map(a => a.description);

    if (sugestões.length > 0 && inputField) {
      const dataList = document.createElement('datalist');
      dataList.id = 'sugestoes';
      sugestões.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        dataList.appendChild(option);
      });

      inputField.setAttribute('list', 'sugestoes');
      document.body.appendChild(dataList);
    }
  }

  adicionarAlimentoAcordeao(alimento: any, mealType: string) {
    // Constrói o ID do acordeão com base no tipo da refeição
    const acordeaoId = `content-${mealType.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s]/g, '')  // Remove caracteres especiais
      .replace(/\s+/g, '-')         // Substitui espaços por traços
      .replace(/-+/g, '-')          // Remove traços consecutivos
      .trim()}`;                    // Remove traços no início ou final
  
    // Log para verificar o ID gerado
    console.log(`Procurando por acordeão com ID: ${acordeaoId}`);
  
    // Obtém o elemento de conteúdo do acordeão
    const acordeaoContent = document.getElementById(acordeaoId);
  
    // Verifica se o elemento de conteúdo do acordeão existe
    if (acordeaoContent) {
      // Cria um novo elemento de parágrafo para adicionar ao acordeão
      const pElement = document.createElement('p');
      pElement.innerHTML = `
        <strong>${alimento.description}</strong><br>
        Calorias: ${alimento.energy_kcal} kcal<br>
        Proteína: ${alimento.protein_g} g<br>
        Gordura: ${alimento.lipid_g} g<br>
        Carboidratos: ${alimento.carbohydrate_g} g
      `;
      // Adiciona o novo elemento ao conteúdo do acordeão
      acordeaoContent.appendChild(pElement);
    } else {
      console.warn(`Elemento de acordeão não encontrado para ${mealType}`);
    }
  }
  
  
}
