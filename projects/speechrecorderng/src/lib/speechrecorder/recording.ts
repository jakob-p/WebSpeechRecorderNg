import { UUID } from '../utils/utils'
import {PromptItem} from "./script/script";


export class RecordingFileDescriptor {

  //sessionId:string|number;
  recording:PromptItem;
  version:number;
  constructor() {}

}

    export class RecordingFile {

      audioBuffer:AudioBuffer;
      sessionId:string|number;
      itemCode:string;
      version:number;
      uuid:string;
      constructor(sessionId:string|number,itemcode:string,version:number,audioBuffer:AudioBuffer) {
          this.sessionId=sessionId;
          this.itemCode=itemcode;
          this.version=version;
          this.audioBuffer=audioBuffer;
          this.uuid=UUID.generate();
      }



      filenameString():string{
        let fns:string='';
        if(this.sessionId){
            fns+=this.sessionId;
            fns+='_';
        }
        if(this.itemCode){
          fns+=this.itemCode;
          fns+='_';
        }
        fns+=this.uuid;
        return fns;
      }
    }

