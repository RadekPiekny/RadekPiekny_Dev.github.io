import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LightningComponent } from './lightning/lightning.component';
import { BitcoinComponent } from './bitcoin/bitcoin.component';
import { RangeSliderComponent } from './components/range-slider/range-slider.component'
import { LightDarkModeComponent } from './components/light-dark-mode/light-dark-mode.component'

@NgModule({
  declarations: [
    AppComponent,
    LightningComponent,
    BitcoinComponent,
    RangeSliderComponent,
    LightDarkModeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
