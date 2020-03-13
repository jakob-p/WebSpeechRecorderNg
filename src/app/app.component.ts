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
    if ('referrer' in document) {
      window.location.href = document.referrer;
    } else {
      window.history.back();
    }
  }
  constructor(){
  }
}
