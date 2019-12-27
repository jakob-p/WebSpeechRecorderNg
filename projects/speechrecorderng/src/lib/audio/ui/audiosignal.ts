import {Marker, Point} from './common'
import {Component, ViewChild, ElementRef} from '@angular/core';
import {CanvasLayerComponent} from "../../ui/canvas_layer_comp";
import {Dimension, Rectangle} from "../../math/2d/geometry";
import {AudioCanvasLayerComponent} from "./audio_canvas_layer_comp";

declare function postMessage(message: any, transfer: Array<any>): void;


@Component({

  selector: 'audio-signal',
  template: `
    <canvas #audioSignal></canvas>
    <canvas #cursor (mouseover)="drawCursorPosition($event, true)" (mousemove)="drawCursorPosition($event, true)"
            (mouseleave)="drawCursorPosition($event, false)"></canvas>
    <canvas #marker></canvas>`,

  styles: [`canvas {
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    position: absolute;
  }`]

})
export class AudioSignal extends AudioCanvasLayerComponent{

  n: any;
  ce: HTMLDivElement;
  @ViewChild('audioSignal', { static: true }) audioSignalCanvasRef: ElementRef;
  @ViewChild('cursor', { static: true }) cursorCanvasRef: ElementRef;
  @ViewChild('marker', { static: true }) playPosCanvasRef: ElementRef;
  signalCanvas: HTMLCanvasElement;
  cursorCanvas: HTMLCanvasElement;
  markerCanvas: HTMLCanvasElement;

  markers: Array<Marker>;
  private _playFramePosition: number;
  private wo: Worker | null;
  private workerURL: string;

  constructor(private ref: ElementRef) {
    super();
    this.wo = null;
    let woFctStr=this.workerFunction.toString()
    let woFctAnon=woFctStr.replace('workerFunction','function')
    let wb = new Blob([ '('+woFctAnon+ ')();'], {type: 'text/javascript'});
    this.workerURL = window.URL.createObjectURL(wb);
    this.audioData = null;
    this.markers = new Array<Marker>();
  }

  ngAfterViewInit() {

    this.ce = this.ref.nativeElement;
    this.signalCanvas = this.audioSignalCanvasRef.nativeElement;
    this.signalCanvas.style.zIndex = '1';
    this.cursorCanvas = this.cursorCanvasRef.nativeElement;
    this.cursorCanvas.style.zIndex = '3';
    this.markerCanvas = this.playPosCanvasRef.nativeElement;
    this.markerCanvas.style.zIndex = '2';

    this.canvasLayers[0]=this.signalCanvas;
    this.canvasLayers[1]=this.cursorCanvas;
    this.canvasLayers[2]=this.markerCanvas;

  }

  get playFramePosition(): number {
    return this._playFramePosition;
  }

  set playFramePosition(playFramePosition: number) {
    this._playFramePosition = playFramePosition;
    this.drawPlayPosition();
  }

  private canvasMousePos(c: HTMLCanvasElement, e: MouseEvent): Point {
    let cr = c.getBoundingClientRect();
    let p = new Point();
    p.x = e.x - cr.left;
    p.y = e.y - cr.top;
    return p;
  }

  drawCursorPosition(e: MouseEvent, show: boolean) {

    if (this.cursorCanvas) {
      let w = this.cursorCanvas.width;
      let h = this.cursorCanvas.height;
      let g = this.cursorCanvas.getContext("2d");
      if (g) {
        g.clearRect(0, 0, w, h);
        if (show) {

          let pp = this.canvasMousePos(this.cursorCanvas, e);
          let xViewPortPixelpos = e.offsetX;

          g.fillStyle = 'yellow';
          g.strokeStyle = 'yellow';
          g.beginPath();
          g.moveTo(xViewPortPixelpos, 0);
          g.lineTo(xViewPortPixelpos, h);
          g.closePath();

          g.stroke();
          if (this.audioData) {

            let framePosRound = this.viewPortXPixelToFramePosition(xViewPortPixelpos);
            g.font = '14px sans-serif';
            g.fillStyle = 'yellow';
            g.fillText(framePosRound.toString(), xViewPortPixelpos + 2, 50);
          }
        }
      }

    }
  }

  drawPlayPosition() {
    if (this.markerCanvas) {
      let w = this.markerCanvas.width;
      let h = this.markerCanvas.height;
      let g = this.markerCanvas.getContext("2d");
      if (g) {
        g.clearRect(0, 0, w, h);
        let pixelPos=this.frameToViewPortXPixelPosition(this._playFramePosition);
        if(pixelPos){
          g.fillStyle = 'red';
          g.strokeStyle = 'red';
          g.beginPath();
          g.moveTo(pixelPos, 0);
          g.lineTo(pixelPos, h);
          g.closePath();
          g.stroke();
        }
      }
    }
  }



  workerFunction() {
        self.addEventListener('message', function (_a) {
          var data = _a.data;
          var audioData = data.audioData;
          var l = data.l;
          var w = data.w;
          var h = data.h;
          var vw = data.vw;
          var chs = data.chs;
          var frameLength = data.frameLength;
          var psMinMax = new Float32Array(0);
          if (audioData && w >= 0 && vw > 0) {
            var framesPerPixel = frameLength / vw;
            var y = 0;
            var pointsLen = w * chs;
            // one for min one for max
            var arrLen = pointsLen * 2;
            psMinMax = new Float32Array(arrLen);
            var chFramePos = 0;
            for (var ch = 0; ch < chs; ch++) {
              var x = 0;
              chFramePos = ch * frameLength;
              for (var pii = 0; pii < w; pii++) {
                var virtPii = l + pii;
                var pMin = Infinity;
                var pMax = -Infinity;
                var pixelFramePos = Math.round(chFramePos + (virtPii * framesPerPixel));
                // calculate pixel min/max amplitude
                for (var ai = 0; ai < framesPerPixel; ai++) {
                  var framePos = pixelFramePos + ai;
                  var a = 0;
                  if (framePos >= 0 && framePos < audioData.length) {
                    a = audioData[framePos];
                  }
                  if (a < pMin) {
                    pMin = a;
                  }
                  if (a > pMax) {
                    pMax = a;
                  }
                }
                var psMinPos = ch * w + pii;
                psMinMax[psMinPos] = pMin;
                var psMaxPos = pointsLen + psMinPos;
                psMinMax[psMaxPos] = pMax;
              }
            }
          }
          postMessage({ psMinMax: psMinMax, l: data.l, t: data.t, w: data.w, h: data.h, chs: data.chs }, [psMinMax.buffer]);
        });
  }

  startDraw(clear = true) {
    if (clear) {

      this.signalCanvas.style.left = Math.round(this.bounds.position.left).toString() + 'px';
      this.signalCanvas.width = Math.round(this.bounds.dimension.width);
      this.signalCanvas.height = Math.round(this.bounds.dimension.height);

      let g = this.signalCanvas.getContext("2d");
      if (g) {
        //g.clearRect(0, 0,w, h);
        g.fillStyle = "black";
        g.fillRect(0, 0, Math.round(this.bounds.dimension.width), Math.round(this.bounds.dimension.height));
      }
    }
    this.startRender();
  }


  private startRender() {

    if (this.wo) {
      this.wo.terminate();
      this.wo = null;
    }
    if (this.bounds && this.bounds.dimension) {

      let w = Math.round(this.bounds.dimension.width);
      let h = Math.round(this.bounds.dimension.height);

      if (this.audioData && w>0 && h>0) {
        //this.wo = new Worker('./audiosignal.worker.js',{type: 'module'});
        this.wo = new Worker(this.workerURL);
        //this.wo = new Worker('worker/audiosignal.worker.ts');

        //let Worker = require('worker!../../../workers/uploader/main');
        let chs = this.audioData.numberOfChannels;

        let frameLength = this.audioData.getChannelData(0).length;
        // if(frameLength != this.audioData.getChannelData(1).length){
        //   alert("Ungleiche Länge");
        // }
        let ad = new Float32Array(chs * frameLength);
        for (let ch = 0; ch < chs; ch++) {
          ad.set(this.audioData.getChannelData(ch), ch * frameLength);
        }
        //let start = Date.now();
        if (this.wo) {
          this.wo.onmessage = (me) => {
            //console.log("As rendertime: ", Date.now() - start);
            this.drawRendered(me);
            if (this.wo) {
              this.wo.terminate();
            }
            this.wo = null;
          }
        }
        this.wo.postMessage({
          l: Math.round(this.bounds.position.left),
          t: Math.round(this.bounds.position.top),
          w: w,
          h: h,
          vw: Math.round(this.virtualDimension.width),
          chs: chs,
          frameLength: frameLength,
          audioData: ad
        }, [ad.buffer]);
      } else {
        let g = this.signalCanvas.getContext("2d");
        if (g) {
          g.clearRect(0, 0, w, h);
        }
      }
    }
  }


  drawRendered(me: MessageEvent) {

    this.signalCanvas.style.left=me.data.l.toString()+'px';
    this.signalCanvas.width = me.data.w;
    this.signalCanvas.height = me.data.h;
    let g = this.signalCanvas.getContext("2d");
    if (g) {
      g.clearRect(0, 0, me.data.w, me.data.h);
      g.fillStyle = "black";
      g.fillRect(0, 0, me.data.w, me.data.h);
      let pointsLen = me.data.w * me.data.chs;
      // one for min one for max
      let arrLen = pointsLen * 2;
      if (this.audioData) {
        let std = Date.now();

        let chH = me.data.h / me.data.chs;

        let y = 0;
        for (let ch = 0; ch < me.data.chs; ch++) {
          let x = 0;

          let psMinPos = ch * me.data.w;
          let psMaxPos = pointsLen + psMinPos;

          g.fillStyle = 'green';
          g.strokeStyle = 'green';

          // draw audio signal as single polygon
          g.beginPath();
          g.moveTo(0, y + (chH / 2) + me.data.psMinMax[psMaxPos] * chH / 2);

          for (let pii = 0; pii < me.data.w; pii++) {
            let psMax = me.data.psMinMax[psMaxPos + pii];
            let pv = psMax * chH / 2;
            let yd=y + (chH / 2) - pv;
            //console.log("LineTo: : "+pii+" "+yd)
            g.lineTo(pii, yd);
          }
          let revPixelStart=me.data.w-1;

          for (let pii = revPixelStart; pii >= 0; pii--) {
            let psMin = me.data.psMinMax[psMinPos + pii];
            let pv = psMin * chH / 2;
            let yd=y + (chH / 2) - pv;
            //console.log("LineTo: : "+pii+" "+yd)
            g.lineTo(pii, yd);
          }
          g.closePath();

          g.fill();
          g.stroke();
          y += chH;
        }

        //this.drawPlayPosition();
      }
    }
  }

  redraw() {

    let g = this.signalCanvas.getContext("2d");
    if (g) {
      let w = this.signalCanvas.width;
      let h = this.signalCanvas.height;
      g.clearRect(0, 0, w, h);
      g.fillStyle = "black";
      g.fillRect(0, 0, w, h);
      if (this.audioData) {
        let std = Date.now();
        let chs = this.audioData.numberOfChannels;
        let chH = h / chs;

        let frameLength = this.audioData.getChannelData(0).length;

        let framesPerPixel = frameLength / w;
        let y = 0;
        for (let ch = 0; ch < chs; ch++) {
          let x = 0;
          let psMin = new Float32Array(w);
          let psMax = new Float32Array(w);
          let framePos = 0;
          for (let pii = 0; pii < w; pii++) {
            let pMin = 0;
            let pMax = 0;

            // calculate pixel min/max amplitude
            for (let ai = 0; ai < framesPerPixel; ai++) {
              //let framePos=(pii*framesPerPixel)+ai;
              let a = this.audioData.getChannelData(ch)[framePos++];

              if (a < pMin) {
                pMin = a;
              }
              if (a > pMax) {
                pMax = a;
              }
            }
            psMin[pii] = pMin;
            psMax[pii] = pMax;
            //console.log("Min: ", pMin, " max: ", pMax);

          }

          g.fillStyle = 'green';
          g.strokeStyle = 'green';

          // draw audio signal as single polygon
          g.beginPath();
          g.moveTo(0, y + (chH / 2) + psMin[0] * chH / 2);

          for (let pii = 0; pii < w; pii++) {
            let pv = psMin[pii] * chH / 2;
            //console.log("Min: ",pv);
            g.lineTo(pii, y + (chH / 2) + pv);
          }
          for (let pii = w; pii >= 0; pii--) {
            let pv = psMax[pii] * chH / 2;
            //console.log("Max: ",pv);
            g.lineTo(pii, y + (chH / 2) + pv);
          }
          g.closePath();
          //g.lineTo()
          g.fill();
          g.stroke();
          g.fillStyle = "yellow";
          g.stroke();
          y += chH;
        }

        //this.drawPlayPosition();
      }
    }
  }

  setData(audioData: AudioBuffer | null) {
    this.audioData = audioData;
    this.playFramePosition = 0;
  }
}

