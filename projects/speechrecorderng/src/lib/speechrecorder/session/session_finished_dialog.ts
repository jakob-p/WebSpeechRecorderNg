
import {Component, Inject} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'spr-session-finished-dialog',
  template: `<h1 mat-dialog-title><mat-icon [style.color]="'green'">done_all</mat-icon> Session finished</h1>
  <div mat-dialog-content>

    <p>Danke! Die Aufnahmen sind jetzt vollständig.</p>

  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="closeDialog()">Weiter</button>
  </div>
  `
})
export class SessionFinishedDialog{

  constructor(
    public dialogRef: MatDialogRef<SessionFinishedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog(): void {
    this.dialogRef.close();
    window.location.href = "/test/"+window.location.href.match(/([^\/]*)\/*$/)[1];
  }

}
