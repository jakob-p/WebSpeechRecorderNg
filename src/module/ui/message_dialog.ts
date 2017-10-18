import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef,MatIcon} from "@angular/material";

@Component({
  selector: 'spr-session-finished-dialog',
  template: `<h1 mat-dialog-title><mat-icon *ngIf="data.type==='error'" [style.color]="'red'">error</mat-icon>
    <mat-icon *ngIf="data.type==='warning'" style.color="yellow">warning</mat-icon>{{data.title}}</h1>
  <div mat-dialog-content>
    
    <p>{{data.msg}}</p>
    <p>{{data.advise}}</p>
   
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="closeDialog()">OK</button>
  </div>
  `
})
export class MessageDialog{

  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

}