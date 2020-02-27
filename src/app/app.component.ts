import {Component} from '@angular/core';
import { VERSION } from '../../projects/speechrecorderng/src/lib/spr.module.version'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sprVersion=VERSION;
  title='KommPaS SpeechRecorder'
  shortTitle='KommPaS Aufnehmen'
  goBack=()=>{
    window.location.href = "/test/"+window.location.href.match(/([^\/]*)\/*$/)[1];
  }
  constructor(){
  }
}
