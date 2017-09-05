import {Injectable, InjectionToken} from "@angular/core";

export let SPEECHRECORDER_CONFIG = new InjectionToken<SpeechRecorderConfig>('speechrecorder.config');


export enum ApiType {
  NORMAL,FILES
}
@Injectable()
export class SpeechRecorderConfig{
  apiEndPoint?: string | null=null;
  apiType?: ApiType | null=null;
  withCredentials?: boolean=false;
  constructor(){
    this.apiEndPoint=null;
    this.apiType=null;
    this.withCredentials=false;
  }
}
