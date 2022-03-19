import { NgModule } from '@angular/core';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BtnScrollTopComponent } from '../btn-scroll-top/btn-scroll-top.component';

@NgModule({
  declarations: [InicioComponent, BtnScrollTopComponent],
  imports: [
    CommonModule,
    InicioRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InicioModule { }
