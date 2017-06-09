import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import {AudioClipUIContainer} from './audio/ui/container';
import {AudioDisplay} from './apps/audio/audio_display';

@NgModule({
  declarations: [
    AppComponent, AudioDisplay,AudioClipUIContainer
  ],
  imports: [
    BrowserModule,NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
