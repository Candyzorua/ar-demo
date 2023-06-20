import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoesOnVtoComponent } from './shoes-on-vto.component';
import { CanvasModule } from '../canvas/canvas.module';

@NgModule({
  declarations: [
    ShoesOnVtoComponent
  ],
  imports: [
    CommonModule,
    CanvasModule
  ],
  exports: [
    ShoesOnVtoComponent
  ]
})
export class ShoesOnVtoModule { }
