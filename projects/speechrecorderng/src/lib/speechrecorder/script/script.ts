
export type Mode = "MANUAL" | "AUTOPROGRESS" | "AUTORECORDING";
export type PromptPhase = "IDLE" | "PRERECORDING" | "RECORDING";


export interface Recinstructions{
  recinstructions:string;
}
export interface Mediaitem {
  text?: string,
  src?: string,
  mimetype?:string
}

export interface PromptItem {
  type?:string;
  itemcode?: string,
  prerecording: number,
  recduration?: number,
  postrecording: number,
  recinstructions?: Recinstructions,
  mediaitems: Array<Mediaitem>
}

export interface Group {
  promptItems: Array<PromptItem>;
}

export interface Section {
  mode: Mode;
  promptphase: PromptPhase;
  training: boolean;
  groups: Array<Group>;
}

export interface Script {
  sections: Array<Section>;
}




