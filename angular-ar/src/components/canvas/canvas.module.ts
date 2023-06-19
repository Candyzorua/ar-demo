import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas.component';

@NgModule({
  declarations: [
    CanvasComponent
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    CanvasComponent
  ]
})
export class CanvasModule { }
