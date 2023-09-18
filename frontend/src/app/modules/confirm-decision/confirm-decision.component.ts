import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MasterPasswordDialogComponent} from "../master-password-dialog/master-password-dialog.component";

@Component({
  selector: 'app-confirm-decision',
  templateUrl: './confirm-decision.component.html',
  styleUrls: ['./confirm-decision.component.scss']
})
export class ConfirmDecisionComponent {
  constructor(
    public dialogRef: MatDialogRef<MasterPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { confirm: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
