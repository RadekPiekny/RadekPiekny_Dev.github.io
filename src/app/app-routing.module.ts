import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitcoinComponent } from './components/bitcoin/bitcoin.component'
import { LightningComponent } from './components/lightning/lightning.component'
import { PlaygroundComponent } from './views/playground/playground.component';
import { ResumeViewComponent } from './views/resume-view/resume-view.component';
import { LightningCanvasComponent } from './components/lightning-canvas/lightning-canvas.component';
import { TwisterComponent } from './components/twister/twister.component';

const routes: Routes = [
  { path: 'resume', component: ResumeViewComponent },
  { path: 'bitcoin', component: BitcoinComponent },
  { path: 'lightning', component: LightningComponent },
  { path: 'lightning-canvas', component: LightningCanvasComponent },
  { path: 'twister', component: TwisterComponent },
  { path: 'playground', component: PlaygroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
