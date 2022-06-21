import { HomeService } from './../../pages/home/home.service';
import { SyncDialogComponent } from './../sync-dialog/sync-dialog.component';
import { KeyModel } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-key',
  templateUrl: './rename-key.component.html',
  styleUrls: ['./rename-key.component.scss'],
})
export class RenameKeyComponent implements OnInit {
  label = '';
  pin = false;
  ref = '';
  keys: KeyModel[] = [];

  constructor(
    private dialogRef: MatDialogRef<RenameKeyComponent>,
    private dialog: MatDialog,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.keys = this.homeService.projectData.keys;

    window.addEventListener('keydown', ($ev) => {
      if ($ev.code === 'Enter') {
        if (this.label.length > 0) {
          this.onSubmit();
          // } else {
          //   const submitRef = document.querySelector(
          //     'button[color="primary"]'
          //   ) as HTMLButtonElement;
          //   if (submitRef) {
          //     setTimeout(() => {
          //       submitRef.click();
          //     }, 200);
          //   }
        }
      }
    });
  }

  onSubmit() {
    if (this.label.length < 1) {
      // alert("Input can't be empty!");
      return;
    }

    if (
      this.keys.findIndex(
        (k) => k.label.toLowerCase() === this.label.toLowerCase()
      ) > -1
    ) {
      // alert('Key exists already!');
      return;
    }

    const newKey = new KeyModel(this.label.trim(), this.pin);
    newKey.ref = this.ref;

    this.dialogRef.close({ newKey });
  }

  onInputChange(elementRef: HTMLInputElement) {
    this.label = elementRef.value;
    const found =
      this.keys.findIndex(
        (k) => k.label.toLowerCase() === this.label.toLowerCase()
      ) > -1;
    if (found) {
      elementRef.style.outline = '2px solid #b22222';
    } else {
      elementRef.style.outline = '2px solid #b2222200';
    }
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
