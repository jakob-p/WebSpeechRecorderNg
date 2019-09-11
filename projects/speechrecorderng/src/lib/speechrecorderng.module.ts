import {ModuleWithProviders, NgModule} from '@angular/core';
import 'hammerjs';
import {SpeechrecorderngComponent} from "./speechrecorderng.component";
import {AudioModule} from "./audio/audio.module";
import {SimpleTrafficLight} from "./speechrecorder/startstopsignal/ui/simpletrafficlight";

import {CommonModule} from "@angular/common";
import {Progress} from "./speechrecorder/session/progress";
import {
  ProgressAndSpeakerContainer,
  PromptContainer, Prompter, Prompting, PromptingContainer, Recinstructions,
} from "./speechrecorder/session/prompting";
import {SessionManager} from "./speechrecorder/session/sessionmanager";
import {WarningBar} from "./speechrecorder/session/warning_bar";
import {ScrollIntoViewDirective} from "./utils/scrollIntoViewToBottom";
import {
    MatButtonModule, MatDialogModule, MatIconModule, MatProgressBar, MatProgressBarModule, MatProgressSpinnerModule,
    MatTooltipModule
} from "@angular/material";
import {HttpClientModule} from "@angular/common/http";
import {SessionService} from "./speechrecorder/session/session.service";
import {ScriptService} from "./speechrecorder/script/script.service";
import {RouterModule, Routes} from "@angular/router";
import {SpeechRecorderConfig, SPEECHRECORDER_CONFIG} from "./spr.config";
import {SpeechRecorderUploader} from "./speechrecorder/spruploader";
import {ProjectService} from "./speechrecorder/project/project.service";
import {ControlPanel, ProgressDisplay, StatusDisplay, TransportPanel, UploadStatus} from "./speechrecorder/session/controlpanel";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SessionFinishedDialog} from "./speechrecorder/session/session_finished_dialog";
import {MessageDialog} from "./ui/message_dialog";
import {LevelBarDisplay} from "./ui/livelevel_display";
import {RecordingService} from "./speechrecorder/recordings/recordings.service";
import {SpeakerInfo} from "./speechrecorder/speaker/speaker_info";
import {ProjectInfo} from "./speechrecorder/project/project_info";




export const SPR_ROUTES: Routes = [
  { path: 'spr/session/:id',      component: SpeechrecorderngComponent },
  { path: 'spr',      component: SpeechrecorderngComponent }
];

@NgModule({
    declarations: [ControlPanel,Progress,SimpleTrafficLight,Recinstructions,Prompter,PromptContainer,PromptingContainer,Prompting,StatusDisplay,
      ProgressDisplay,LevelBarDisplay,UploadStatus,TransportPanel,ControlPanel,WarningBar,SessionManager,MessageDialog,SessionFinishedDialog,SpeechrecorderngComponent,ScrollIntoViewDirective,ProjectInfo,SpeakerInfo,ProgressAndSpeakerContainer],
  entryComponents: [
    MessageDialog,SessionFinishedDialog
  ],
    exports: [SpeechrecorderngComponent],
  imports: [RouterModule.forChild(SPR_ROUTES),FlexLayoutModule,CommonModule,
    AudioModule,MatIconModule,MatButtonModule,MatDialogModule,MatProgressBarModule,MatProgressSpinnerModule,MatTooltipModule,HttpClientModule],
  providers: [SessionService,ProjectService,ScriptService,RecordingService,SpeechRecorderUploader]

})
export class SpeechrecorderngModule{

  static forRoot(config: SpeechRecorderConfig): ModuleWithProviders {
    return {
      ngModule: SpeechrecorderngModule,
      providers: [
        {provide: SPEECHRECORDER_CONFIG, useValue: config }
      ]
    };
  }
}
