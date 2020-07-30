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
import { LightningCanvasComponent } from './components/lightning-canvas/lightning-canvas.component';
import { ResumeViewComponent } from './views/resume-view/resume-view.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TwisterComponent } from './components/twister/twister.component';
import { LightningWebglComponent } from './components/lightning-webgl/lightning-webgl.component';
import { FpsMeterComponent } from './components/fps-meter/fps-meter.component';
import { FpsMeterCanvasComponent } from './components/fps-meter-canvas/fps-meter-canvas.component';
import { ComponentPlaygroundComponent } from './views/component-playground/component-playground.component';
import { IconDirective } from './directives/icon.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    LightningComponent,
    BitcoinComponent,
    RangeSliderComponent,
    LightDarkModeComponent,
    SkillRangeComponent,
    PlaygroundComponent,
    LightningCanvasComponent,
    ResumeViewComponent,
    LoadingComponent,
    TwisterComponent,
    LightningWebglComponent,
    FpsMeterComponent,
    FpsMeterCanvasComponent,
    ComponentPlaygroundComponent,
    IconDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
