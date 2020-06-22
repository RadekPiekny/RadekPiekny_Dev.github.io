import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitcoinComponent } from './components/bitcoin/bitcoin.component'
import { LightningComponent } from './components/lightning/lightning.component'
import { PlaygroundComponent } from './views/playground/playground.component';
import { ResumeViewComponent } from './views/resume-view/resume-view.component';

const routes: Routes = [
  { path: 'resume', component: ResumeViewComponent },
  { path: 'bitcoin', component: BitcoinComponent },
  { path: 'lightning', component: LightningComponent },
  { path: 'playground', component: PlaygroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
