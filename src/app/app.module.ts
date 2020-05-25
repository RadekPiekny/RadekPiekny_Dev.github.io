import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LightningComponent } from './components/lightning/lightning.component';
import { BitcoinComponent } from './components/bitcoin/bitcoin.component';
import { RangeSliderComponent } from './components/range-slider/range-slider.component'
import { LightDarkModeComponent } from './components/light-dark-mode/light-dark-mode.component';
import { SkillRangeComponent } from './components/skill-range/skill-range.component';
import { PlaygroundComponent } from './views/playground/playground.component';
import { LightningCanvasComponent } from './components/lightning-canvas/lightning-canvas.component'

@NgModule({
  declarations: [
    AppComponent,
    LightningComponent,
    BitcoinComponent,
    RangeSliderComponent,
    LightDarkModeComponent,
    SkillRangeComponent,
    PlaygroundComponent,
    LightningCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
