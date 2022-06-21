import { HomeService } from './../../pages/home/home.service';
import { SyncDialogComponent } from './../sync-dialog/sync-dialog.component';
import { KeyModel } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-key',
  templateUrl: './new-key.component.html',
  styleUrls: ['./new-key.component.scss'],
})
export class NewKeyComponent implements OnInit {
  label = '';
  pin = false;
  ref = '';

  constructor(
    private dialogRef: MatDialogRef<NewKeyComponent>,
    private dialog: MatDialog,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    window.addEventListener('keydown', ($ev) => {
      if ($ev.code === 'Enter') {
        if (this.label.length > 0) {
          this.onSubmit();
        } else {
          const submitRef = document.querySelector(
            'button[color="primary"]'
          ) as HTMLButtonElement;
          if (submitRef) {
            setTimeout(() => {
              submitRef.click();
            }, 200);
          }
        }
      }
    });
  }

  onSubmit() {
    if (this.label.length < 1) {
      // alert("Input can't be empty!");
      return;
    }

    const newKey = new KeyModel(this.label, this.pin);
    newKey.ref = this.ref;

    this.dialogRef.close({ newKey });
  }

  onInputChange(input: string) {
    this.label = input;
  }

  onSync() {
    const index = this.homeService.references.findIndex(
      (ref) => ref === this.ref
    );

    const _dialogRef = this.dialog.open(SyncDialogComponent, {
      data: { index, from: 'new-key' },
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.ref = data.ref;

        if (data.ref && data.ref.length > 0) {
          this.pin = false;
        }
      }
    });
  }
}
