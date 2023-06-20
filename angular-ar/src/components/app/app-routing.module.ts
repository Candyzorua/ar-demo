import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarefootVtoComponent } from '../barefoot-vto/barefoot-vto.component';
import { ShoesOnVtoComponent } from '../shoes-on-vto/shoes-on-vto.component';

const routes: Routes = [
  { path: "", redirectTo: 'barefoot-vto', pathMatch: "full"},
  { path: 'barefoot-vto', component: BarefootVtoComponent },
  { path: 'shoes-on-vto', component: ShoesOnVtoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
