import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitcoinComponent } from './bitcoin/bitcoin.component'
import { LightningComponent } from './lightning/lightning.component'

const routes: Routes = [
  { path: 'bitcoin', component: BitcoinComponent },
  { path: 'lightning', component: LightningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
