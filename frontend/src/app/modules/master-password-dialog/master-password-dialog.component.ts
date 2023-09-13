import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-master-password-dialog',
  templateUrl: './master-password-dialog.component.html',
  styleUrls: ['./master-password-dialog.component.scss'],
})
export class MasterPasswordDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MasterPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { masterPassword: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
