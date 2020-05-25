import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitcoinComponent } from './components/bitcoin/bitcoin.component'
import { LightningComponent } from './components/lightning/lightning.component'
import { PlaygroundComponent } from './views/playground/playground.component';

const routes: Routes = [
  { path: 'bitcoin', component: BitcoinComponent },
  { path: 'lightning', component: LightningComponent },
  { path: 'playground', component: PlaygroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
