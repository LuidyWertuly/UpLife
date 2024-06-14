import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'configuracoes',
    loadChildren: () => import('./pages/configuracoes/configuracoes.module').then( m => m.ConfiguracoesPageModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./pages/historico/historico.module').then( m => m.HistoricoPageModule)
  },
  {
    path: 'corrida',
    loadChildren: () => import('./pages/corrida/corrida.module').then( m => m.CorridaPageModule)
  },
  {
    path: 'config-corrida',
    loadChildren: () => import('./pages/config-corrida/config-corrida.module').then( m => m.ConfigCorridaPageModule)
  },
  {
    path: 'tabs-corrida',
    loadChildren: () => import('./pages/tabs-corrida/tabs-corrida.module').then( m => m.TabsCorridaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'mais-info',
    loadChildren: () => import('./pages/mais-info/mais-info.module').then( m => m.MaisInfoPageModule)
  },
  {
    path: 'inicial',
    loadChildren: () => import('./pages/inicial/inicial.module').then( m => m.InicialPageModule)
  },
  {
    path: 'tenis',
    loadChildren: () => import('./pages/tenis/tenis.module').then( m => m.TenisPageModule)
  },
  {
    path: 'esqueci-senha',
    loadChildren: () => import('./pages/esqueci-senha/esqueci-senha.module').then( m => m.EsqueciSenhaPageModule)
  },
  {
    path: 'tabs-alimentacao',
    loadChildren: () => import('./pages/tabs-alimentacao/tabs-alimentacao.module').then( m => m.TabsAlimentacaoPageModule)
  },
  {
    path: 'historico-alimentacao',
    loadChildren: () => import('./pages/historico-alimentacao/historico-alimentacao.module').then( m => m.HistoricoAlimentacaoPageModule)
  },
  {
    path: 'editar-conta',
    loadChildren: () => import('./pages/editar-conta/editar-conta.module').then( m => m.EditarContaPageModule)
  },
  {
    path: 'mudar-email',
    loadChildren: () => import('./pages/mudar-email/mudar-email.module').then( m => m.MudarEmailPageModule)
  },
  {
    path: 'confirmar-email',
    loadChildren: () => import('./pages/confirmar-email/confirmar-email.module').then( m => m.ConfirmarEmailPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
