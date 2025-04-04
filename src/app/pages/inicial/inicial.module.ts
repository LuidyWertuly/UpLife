import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { InicialPageRoutingModule } from './inicial-routing.module';

import { InicialPage } from './inicial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicialPageRoutingModule
  ],
  declarations: [InicialPage],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class InicialPageModule {}
