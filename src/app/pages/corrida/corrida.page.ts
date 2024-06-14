import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-image';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-corrida',
  templateUrl: './corrida.page.html',
  styleUrls: ['./corrida.page.scss'],
})
export class CorridaPage implements OnInit, OnDestroy {
  map: any;
  userMarker: any;
  watchId: any;
  modalPause = false;
  modalTreino = false;
  confirmarModal = false;

  startTime: any;
  pausedTime: number = 0;
  distance: number = 0;
  polyline: any;
  lastPosition: L.LatLngTuple | null = null;
  intervalId: any;
  isPaused: boolean = false;

  activeTime: number = 0;
  pesoUsuario: number = 0;
  calorias: number = 0;

  rotaImageUrl: string | null = null;
  userId: string | null = null;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.carregarMapa();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.firestore
          .collection('users', (ref) => ref.where('user_id', '==', user.uid))
          .get()
          .subscribe(
            (snapshot) => {
              if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const data: any = doc.data();
                if (data && data.peso) {
                  this.pesoUsuario = data.peso;
                }
              }
            },
            (error) => {
              console.error('Erro ao buscar documento do usuário:', error);
            }
          );
      }
    });
  }

  ngOnDestroy() {
    this.pararTreino();
  }

  carregarMapa() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: L.LatLngTuple = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          this.map = L.map('map', {
            center: pos,
            zoom: 18,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
          }).addTo(this.map);

          this.userMarker = L.circleMarker(pos, {
            radius: 8,
            fillColor: '#4285F4',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
          }).addTo(this.map);

          this.polyline = L.polyline([], { color: 'red' }).addTo(this.map);
          this.posicao();
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  posicao() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (this.isPaused) return;

          const pos: L.LatLngTuple = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          this.userMarker.setLatLng(pos);
          this.map.setView(pos);

          if (this.lastPosition) {
            const distanceIncrement = this.map.distance(
              this.lastPosition,
              pos
            );
            this.distance += distanceIncrement;
          }

          this.lastPosition = pos;

          if (this.polyline) {
            this.polyline.addLatLng(pos);
          }
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  comecarTreino() {
    this.startTime = new Date().getTime();
    this.lastPosition = null;
    this.distance = 0;
    this.activeTime = 0;
    this.isPaused = false;

    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }

    this.polyline = L.polyline([], { color: 'red' }).addTo(this.map);
    this.modalTreino = true;

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.activeTime = new Date().getTime() - this.startTime - this.pausedTime;
        this.calorias = Math.round(this.calcularCalorias(
          this.pesoUsuario,
          this.activeTime / 3600000
        ));
      }
    }, 1000);
  }

  calcularRitmoMedio(): string {
    if (this.distance === 0) {
      return "-'--''";
    }

    const elapsedTime = this.activeTime / 1000;
    const minutes = elapsedTime / 60;
    const pace = minutes / (this.distance / 1000);
    const minutesPart = Math.floor(pace);
    const secondsPart = Math.floor((pace - minutesPart) * 60);

    return `${minutesPart}'${secondsPart < 10 ? '0' : ''}${secondsPart}''`;
  }

  calcularCalorias(pesoUsuario: number, tempoAtivoEmHoras: number): number {
    const met = 9.8;
    return pesoUsuario * met * tempoAtivoEmHoras;
  }

  calcularTempoDecorrido(): string {
    const elapsedTime = this.activeTime / 1000;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  pausarTreino() {
    this.isPaused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.pausedTime += new Date().getTime() - this.startTime - this.activeTime;
    this.modalTreino = false;
    this.modalPause = true;
    this.capturarMapaComoImagem().then(() => {
      // Captura do mapa concluída, se necessário faça algo aqui.
    });
  }

  retomarTreino() {
    this.modalPause = false;
    this.isPaused = false;
    this.startTime = new Date().getTime() - this.activeTime - this.pausedTime;
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.activeTime = new Date().getTime() - this.startTime - this.pausedTime;
      }
    }, 1000);
    this.modalTreino = true;
  }

  pararTreino() {
    this.modalPause = false;
    this.confirmarModal = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  salvarHistorico(escolha: boolean) {
    if (escolha) {
      this.confirmarModal = false;
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR');
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const distanciaFormatada = this.distance.toFixed(2);

      const treino = {
        user_id: this.userId,
        distancia: distanciaFormatada,
        duracao: this.calcularTempoDecorrido(),
        calorias: this.calorias,
        ritmoMedio: this.calcularRitmoMedio(),
        rota: this.rotaImageUrl,
        data: dateStr,
        hora: timeStr
      };

      console.log(treino);

      this.firestore.collection('corridas').add(treino).then((docRef) => {
        const corrida_id = docRef.id;
        console.log('Dados do treino salvos no Firestore com sucesso');

        return docRef.update({ corrida_id: corrida_id });
      }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/home/tabsCorrida/historico']);
        }, 300);
      }).catch(error => {
        console.error('Erro ao salvar dados do treino no Firestore:', error);
      });
    } else {
      this.confirmarModal = false;
      this.router.navigate(['/home/tabsCorrida']);
    }
  }

  capturarMapaComoImagem(): Promise<void> {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      return Promise.reject('Elemento do mapa não encontrado.');
    }
  
    return new Promise<void>((resolve, reject) => {
      if (typeof (window as any).leafletImage === 'function') {
        (window as any).leafletImage(this.map, (err: any, canvas: HTMLCanvasElement) => {
          if (err) {
            console.error('Erro ao capturar o mapa como imagem:', err);
            reject(err);
            return;
          }
    
          canvas.toBlob((blob) => {
            if (blob) {
              const filePath = `imagens/${Date.now()}.png`;
              const fileRef = this.storage.ref(filePath);
              const uploadTask = fileRef.put(blob);
    
              uploadTask.then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                  this.rotaImageUrl = downloadURL;
                  resolve();
                });
              }).catch((error) => {
                console.error('Erro ao enviar a imagem para o Firebase Storage:', error);
                reject(error);
              });
            } else {
              console.error('Erro ao criar o Blob da imagem.');
              reject('Erro ao criar o Blob da imagem.');
            }
          }, 'image/png');
        });
      } 
      
      else {
        console.error('leafletImage não está disponível.');
        reject('leafletImage não está disponível.');
      }
      
    });
  }

  IrparaConfigCorrida() {
    this.router.navigate(['/config-corrida']);
  }

  IrparaTenis() {
    this.router.navigate(['/tenis']);
  }

  recusarTreino() {
    this.confirmarModal = false;
  }
}
