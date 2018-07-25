import { NgModule } from '@angular/core';


import {AudioClipUIContainer} from "./ui/container";
import {AudioDisplay} from "./audio_display";
import {AudioSignal} from "./ui/audiosignal";
import {Sonagram} from "./ui/sonagram";
import {LevelBar} from "./ui/livelevel";
import {CommonModule} from "@angular/common";
import {MatButtonModule,MatDialogModule, MatIconModule} from "@angular/material";
import {AudioDisplayControl} from "./ui/audio_display_control";
import {ScrollPaneHorizontal} from "./ui/scroll_pane_horizontal";
import {AudioDisplayScrollPane} from "./ui/audio_display_scroll_pane";

@NgModule({
    declarations: [ScrollPaneHorizontal,AudioClipUIContainer,AudioSignal,Sonagram,AudioDisplay,AudioDisplayScrollPane,AudioDisplayControl,LevelBar],
    exports: [ScrollPaneHorizontal,AudioClipUIContainer,AudioDisplayScrollPane,AudioDisplay,AudioDisplayControl,LevelBar],
    imports: [CommonModule,MatIconModule,MatButtonModule,MatDialogModule]
})
export class AudioModule{

}
