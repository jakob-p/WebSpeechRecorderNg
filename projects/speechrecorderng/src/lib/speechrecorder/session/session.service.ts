import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiType, SPEECHRECORDER_CONFIG, SpeechRecorderConfig} from "../../spr.config";
import {Session} from "./session";
import {UUID} from "../../utils/utils";
import {Observable} from "rxjs";
import {ProjectService} from "../project/project.service";



@Injectable()
export class SessionService {
  public static readonly SESSION_API_CTX='session';
  private apiEndPoint='';
  private sessionsUrl:string;
  private withCredentials:boolean=false;

  constructor(private http:HttpClient,@Inject(SPEECHRECORDER_CONFIG) private config?:SpeechRecorderConfig) {

    if(config && config.apiEndPoint) {
      this.apiEndPoint=config.apiEndPoint;
    }
    if(this.apiEndPoint !== ''){
      this.apiEndPoint=this.apiEndPoint+'/'
    }
    if(config!=null && config.withCredentials!=null){
      this.withCredentials=config.withCredentials;
    }
    this.sessionsUrl = this.apiEndPoint + SessionService.SESSION_API_CTX;
  }

  sessionObserver(id: string): Observable<Session> {

    let sessUrl = this.sessionsUrl + '/' + id;
    if (this.config && this.config.apiType === ApiType.FILES) {
      // for development and demo
      // append UUID to make request URL unique to avoid localhost server caching
      sessUrl = sessUrl + '.json?requestUUID='+UUID.generate();
    }
    return this.http.get<Session>(sessUrl,{ withCredentials: this.withCredentials });

  }


  putSessionObserver(session:Session): Observable<Session> {

    let sesssUrl = this.apiEndPoint+ProjectService.PROJECT_API_CTX +'/'+session.project+'/'+SessionService.SESSION_API_CTX +'/'+session.sessionId

    //console.log("PUT session ID: "+session.sessionId+ " status: "+session.status)
    return this.http.put<Session>(sesssUrl, session,{withCredentials: this.withCredentials});

  }

}



