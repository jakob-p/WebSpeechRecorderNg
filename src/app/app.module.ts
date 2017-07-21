import { BrowserModule } from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import {AudioClipUIContainer} from '../module/audio/ui/container';
import {AudioDisplay} from '../module/audio/audio_display';

import { Progress } from '../module/speechrecorder/session/progress'
import {SpeechRecorder} from '../module/speechrecorder/speechrecorder'
import {
  Prompting, PromptContainer, Prompter,
  TransportPanel, StatusDisplay, ControlPanel, ProgressDisplay, SessionManager
} from '../module/speechrecorder/session/sessionmanager';

import { SimpleTrafficLight} from '../module/speechrecorder/startstopsignal/ui/simpletrafficlight'
import {SessionService} from "../module/speechrecorder/session/session.service";
import {HttpModule} from "@angular/http";
import {ScriptService} from "../module/speechrecorder/script/script.service";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MdButtonModule, MdDialogModule, MdIconModule, MdMenu, MdMenuItem, MdMenuModule,
  MdToolbarModule
} from "@angular/material";
import {AudioDisplayDialog} from "../module/audio/audio_display_dialog";
import {ScrollIntoViewDirective} from "../module/utils/scrollintoview";
import {Config, SpeechRecorderModule} from "../module/speechrecorder/spr.module";
import {AudioModule} from "../module/audio/audio.module";


const appRoutes: Routes = [

    { path: 'test',
        redirectTo: 'session/',
        pathMatch: 'full'
    },
    { path: 'audio_display', component: AudioDisplay
    }
];
export let SPEECHRECORDER_CONFIG = new InjectionToken<Config>('app.config');
export const SPR_CFG: Config = {
  apiEndPoint: 'http://localhost:8000/api/test_from config'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
    AudioDisplayDialog
  ],
  imports: [
      RouterModule.forRoot(appRoutes),BrowserAnimationsModule,MdToolbarModule,MdMenuModule,MdIconModule,MdButtonModule,MdDialogModule,
      HttpModule,
    BrowserModule,SpeechRecorderModule,AudioModule
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }

