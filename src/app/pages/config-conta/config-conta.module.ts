import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigContaPageRoutingModule } from './config-conta-routing.module';

import { ConfigContaPage } from './config-conta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigContaPageRoutingModule
  ],
  declarations: [ConfigContaPage]
})
export class ConfigContaPageModule {}
