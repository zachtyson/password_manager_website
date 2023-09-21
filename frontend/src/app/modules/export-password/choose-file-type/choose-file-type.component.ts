import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MasterPasswordDialogComponent} from "../../master-password-dialog/master-password-dialog.component";

@Component({
  selector: 'app-choose-file-type',
  templateUrl: './choose-file-type.component.html',
  styleUrls: ['./choose-file-type.component.scss']
})
export class ChooseFileTypeComponent {
  constructor(
    public dialogRef: MatDialogRef<MasterPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { confirm: string, extension: 'json' | 'csv' }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
