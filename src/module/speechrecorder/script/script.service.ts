/**
 * Created by klausj on 17.06.2017.
 */
import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';
import {ApiType, SPEECHRECORDER_CONFIG, SpeechRecorderConfig} from "../spr.config";
import {Script} from "./script";
import {UUID} from "../../utils/utils";


export const SCRIPT_API_CTX='script'

@Injectable()
export class ScriptService {
  private scriptCtxUrl:string;
  private withCredentials:boolean=false;
  private httpParams:HttpParams;
  constructor(private http:HttpClient,@Inject(SPEECHRECORDER_CONFIG) private config?:SpeechRecorderConfig) {

    let apiEndPoint = ''

    if(config && config.apiEndPoint) {
      apiEndPoint=config.apiEndPoint;
    }
    if(apiEndPoint !== ''){
      apiEndPoint=apiEndPoint+'/'
    }
    if(config!=null && config.withCredentials!=null){
      this.withCredentials=config.withCredentials;
    }

    this.scriptCtxUrl = apiEndPoint + SCRIPT_API_CTX;
    this.httpParams=new HttpParams();
    this.httpParams.set('cache','false');
  }

  getScript(id:string | number):Promise<Script>{

    let scriptUrl = this.scriptCtxUrl + '/' + id;
    if (this.config && this.config.apiType === ApiType.FILES) {
      // for development and demo
      // append UUID to make request URL unique to avoid localhost server caching
      scriptUrl = scriptUrl + '.json?requestUUID='+UUID.generate();
    }
    let scriptProms = this.http.get(scriptUrl,{params:this.httpParams, withCredentials: this.withCredentials }).toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);

    return scriptProms;
   }

    private handleError(error: any): Promise<any> {

        let errMsg='Could not load script '+error.message;
        console.error(errMsg, error);
        return Promise.reject(errMsg);
    }
}



