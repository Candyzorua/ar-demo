import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarefootVtoComponent } from './barefoot-vto.component';
import { CanvasModule } from '../canvas/canvas.module';

@NgModule({
  declarations: [
    BarefootVtoComponent
  ],
  imports: [
    CommonModule,
    CanvasModule
  ],
  exports: [
    BarefootVtoComponent
  ]
})
export class BarefootVtoModule { }
